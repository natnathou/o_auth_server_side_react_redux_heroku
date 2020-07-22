const router               = require("express").Router()
const passport             = require("passport")
const jwt                  = require('jsonwebtoken')
const nodemailer           = require("nodemailer")
const User                 = require("../models/user-model")
const utilities            = require("../utilities")
const CLIENT_HOME_PAGE_URL = process.env.URL_CLIENT;


router.post("/forgot-password", async (req, res) => {
    let email = req.body.email
    let token = jwt.sign({email: email}, process.env.TOP_SECRET, {expiresIn: 300})  // expiry in seconds

    let urlRedirection = `${process.env.URL_SERVER}/auth/update-password/?secret_token=${token}`
    let mailOptions    = {
        envelope: {
            from: `<${process.env.USER_EMAIL}>`,   // used as MAIL FROM: address for SMTP
            to  : `<${email}>`  // used as RCPT TO: address for SMTP
        },
        from    : process.env.USER_EMAIL,
        to      : email,
        subject : 'Password Reinitialization',
        text    : `Please Click on the link below to update your password \n ${urlRedirection}`

    }

    let transporter = nodemailer.createTransport({
        host  : process.env.HOST_EMAIL_SERVER,
        port  : 587,
        secure: false,
        auth  : {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL
        },
        tls   : {
            rejectUnauthorized: false
        }
    })

    try {
        let exist=false;
        let i=0
        let allUser = await User.find({})
        allUser.forEach((users, index)=>{
            if(email === utilities.decrypt(users.email, users.iv, process.env.KEY_ENCRYPTION)){
                exist=true;
                i=index
            }
        })

        if (exist) {
            await allUser[i].updateOne({token: token});
            await allUser[i].save();
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                     console.log(error);
                    res.json({
                        status: "their are an error"
                    })

                } else {
                    console.log(info);
                    res.json(
                        {message: "Password update request has been sent by email!"}
                    )
                }
            });
        } else {
            res.json(
                {message: "User doesn't exist!"}
            )
        }

    } catch (e) {
        console.log(e)
    }
});


router.get("/update-password/", passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        res.cookie('JWT', req.query.secret_token);
        res.redirect(`${CLIENT_HOME_PAGE_URL}/update-password`);
    });

router.get("/update-password/authenticate", passport.authenticate("jwt", {session: false}),
    (req, res) => {
        res.json({
            success: true,
            message: "Token is valid"
        })
    });

router.post("/update-password/", passport.authenticate("jwt", {session: false}),
    async (req, res, next) => {
        try{
            let exist=false;
            let i=0
            let allUser = await User.find({})
            allUser.forEach((users, index)=>{
                if(req.body.token === users.token){
                    exist=true;
                    i=index
                }
            })
            if (exist) {
                allUser[i].setPassword(req.body.password);
                allUser[i].save();
                console.log('Password reset successful');
                res.json(
                    {redirect: `${CLIENT_HOME_PAGE_URL}/login`}
                )

            } else {
                console.log("Password not change");
                res.json(
                    {message: `User doesn't exist!`}
                )
            }

        }  catch(e){
            console.log(e)
        }      

    });

module.exports = router;