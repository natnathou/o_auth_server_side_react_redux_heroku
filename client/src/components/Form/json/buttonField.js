// json of our buttons
const buttonField = {
    login:
        [   
            {
                function: "forgot-password", //verif
                value   : "Forgot Password",
                color   : "gray"
            },
            {
                function: "send",
                value   : "Send",
                color   : "blue-twitter"
            }
            
        ],
    signup:
        [
            {
                function: "send",
                value   : "Send",
                color   : "blue-twitter"
            }
        ],
    forgotPassword:
        [
            {
                function: "send",
                value   : "Send",
                color   : "blue-twitter"
            }
        ],
    updatePassword:
        [
            {   
                function: "update-password", //verif
                value   : "update Password",
                color   : "blue-twitter"
            }
        ]
};

export default buttonField;