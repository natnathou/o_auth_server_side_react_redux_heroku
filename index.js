const dotenv        = require('dotenv')
const cookieSession = require("cookie-session")
const express       = require("express")
const passport      = require("passport")
const session       = require("express-session")
const mongoose      = require("mongoose")
const cookieParser  = require("cookie-parser") // parse cookie header
const bodyParser    = require("body-parser")
const utilities     = require("./utilities")
const path          = require("path")
const app  = express()
const port = process.env.PORT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const passportSetup  = require("./config/passport-setup")
const authRoutes     = require("./routes/auth-routes")
const forgotPassword = require("./routes/forgot-password")

// set up cors to allow us to accept requests from our client, but no need because we make a proxy
// const cors = require("cors");
// app.use(
//   cors({
//     origin     : `${process.env.URL_CLIENT}`,            // allow to server to accept request from different origin
//     methods    : "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true                                // allow session cookie from browser to pass through
//   })
// );


// connect to mongodb
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("connected to mongo db");
});

require("./seedDb");

app.use(
    cookieSession({
        name  : "session",
        keys  : [process.env.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
    })
);

// parse cookies
app.use(cookieParser());


// initalize passport
app.use(passport.initialize());


// deserialize cookie from the browser
app.use(passport.session());


// set up routes
app.use("/auth", authRoutes);
app.use("/auth", forgotPassword);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
