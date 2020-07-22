const passport         = require("passport")
const LocalStrategy    = require('passport-local')
const passportGoogle   = require("passport-google-oauth")
const FacebookStrategy = require("passport-facebook")
const TwitterStrategy  = require("passport-twitter")
const JWTstrategy      = require('passport-jwt').Strategy
const User             = require("../models/user-model")
const utilities        = require("../utilities")
const GoogleStrategy   = passportGoogle.OAuth2Strategy


passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            let exist=false;
            let i=0;
            let allUser = await User.find({})
            allUser.forEach((users,index)=>{
                if(username === utilities.decrypt(users.username, users.iv, process.env.KEY_ENCRYPTION)){
                    exist=true;
                    i=index
                }
            })
            if (!allUser[i] || !allUser[i].validatePassword(password)) {
                return done(null, false)
            } else {
                return done(null, allUser[i]);
            }

        } catch (e) {
            console.log(e)
        }

    }));

passport.use(
    new GoogleStrategy(
        {
            // options for the google start
            clientID    : process.env.GOOGLE_CONSUMER_KEY,
            clientSecret: process.env.GOOGLE_CONSUMER_SECRET,
            callbackURL : `${process.env.URL_SERVER}/auth/google/redirect`,
        },
        async (token, refreshToken, profile, cb) => {
            try {
                let exist=false;
                let i=0;
                let allUser = await User.find({})
                allUser.forEach((users,index)=>{
                    if(profile.emails[0].value === utilities.decrypt(users.username, users.iv, process.env.KEY_ENCRYPTION)){
                        exist=true;
                        i=index;
                    }
                })                
                // create new user if the database doesn't have this user
                if (!exist) {
                    let newUser = await User.create({
                        username  : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).encryptedData,
                        provider  : utilities.encrypt(profile.provider, process.env.KEY_ENCRYPTION).encryptedData,
                        idProvider: utilities.encrypt(profile.id, process.env.KEY_ENCRYPTION).encryptedData,
                        name      : utilities.encrypt(profile.displayName, process.env.KEY_ENCRYPTION).encryptedData,
                        email     : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).encryptedData,
                        iv        : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).iv
                    });
                    await newUser.setPassword(token);
                    await newUser.save();
                    console.log(newUser);
                    cb(null, newUser)
                } else {
                    cb(null, allUser[i])
                }
            } catch (e) {
                console.log(e)
            }
        }
    )
);


passport.use(
    new FacebookStrategy(
        {
            // options for the facebook start
            clientID     : process.env.FACEBOOK_CONSUMER_KEY,
            clientSecret : process.env.FACEBOOK_CONSUMER_SECRET,
            callbackURL  : `${process.env.URL_SERVER}/auth/facebook/redirect`,
            profileFields: ['id', 'displayName', 'emails']
        },
        async (token, refreshToken, profile, cb) => {
            try {
                // find current user in UserModel
                let exist=false;
                let i=0;
                let allUser = await User.find({})
                allUser.forEach((users,index)=>{
                        console.log(users)
                        if(profile.emails[0].value === utilities.decrypt(users.username, users.iv, process.env.KEY_ENCRYPTION)){
                            exist=true;
                            i=index;
                        }
                })              
                // create new user if the database doesn't have this user
                if (!exist) {
                    let newUser = await User.create({
                        username  : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).encryptedData,
                        provider  : utilities.encrypt(profile.provider, process.env.KEY_ENCRYPTION).encryptedData,
                        idProvider: utilities.encrypt(profile.id, process.env.KEY_ENCRYPTION).encryptedData,
                        name      : utilities.encrypt(profile.displayName, process.env.KEY_ENCRYPTION).encryptedData,
                        email     : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).encryptedData,
                        iv        : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).iv
                    });
                    await newUser.setPassword(token);
                    await newUser.save();
                    console.log(newUser);
                    cb(null, newUser)
                } else {
                    cb(null, allUser[i])
                }
            } catch (e) {
                console.log(e);
            }
        }
    )
);


passport.use(
    new TwitterStrategy(
        {
            // options for the facebook start
            consumerKey   : process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL   : `${process.env.URL_SERVER}/auth/twitter/redirect`,
            includeEmail  : true
        },
        async (token, refreshToken, profile, cb) => {
            try {
                // find current user in UserModel
                let exist=false;
                let i=0;
                let allUser = await User.find({})
                allUser.forEach((users,index)=>{
                    if(profile.emails[0].value === utilities.decrypt(users.username, users.iv, process.env.KEY_ENCRYPTION)){
                        exist=true;
                        i=index;
                    }
                })   
                // create new user if the database doesn't have this user
                if (!exist) {
                    let newUser = await User.create({
                        username  : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).encryptedData,
                        provider  : utilities.encrypt(profile.provider, process.env.KEY_ENCRYPTION).encryptedData,
                        idProvider: utilities.encrypt(profile.id, process.env.KEY_ENCRYPTION).encryptedData,
                        name      : utilities.encrypt(profile.displayName, process.env.KEY_ENCRYPTION).encryptedData,
                        email     : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).encryptedData,
                        iv        : utilities.encrypt(profile.emails[0].value, process.env.KEY_ENCRYPTION).iv
                    });
                    await newUser.setPassword(token);
                    await newUser.save();
                    console.log(newUser);
                    cb(null, newUser)
                } else {
                    cb(null, allUser[i])
                }
            } catch (e) {
                console.log(e)
            }
        }
    )
);

let url                = require('url');
const options          = {};
options.jwtFromRequest = (request) => {
    let token      = null
    let param_name = 'authorization'                //parameter name
    let parsed_url = url.parse(request.url, true)
    if (request.headers[param_name]) {
        token = request.headers[param_name]
    } else if (parsed_url.query && Object.prototype.hasOwnProperty.call(parsed_url.query, "secret_token")) {
        token = parsed_url.query["secret_token"]
    }
    return token;
};
options.secretOrKey    = process.env.TOP_SECRET;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy(
    options
    , async (token, done) => {
        try {
            //Pass the user details to the next middleware
            return done(null, token)
        } catch (error) {
            done(error)
        }
    }));

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, cb) => {
    cb(null, user.id)
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, cb) => {
    User.findById(id)
        .then(user => {
            cb(null, user)
        })
        .catch(e => {
            cb(new Error("Failed to deserialize an user"))
        });
});
