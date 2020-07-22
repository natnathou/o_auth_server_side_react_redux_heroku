const User = require("./models/user-model")

const findAllUsers = async () => {
    try {
        const users = await User.find({})
        console.log(users);
    } catch (e) {
        console.log(e);
    }
}

// findAllUsers();


const deleteMany = async () => {
    try {
        const users = await User.deleteMany({})
        console.log(users);
    } catch (e) {
        console.log(e);
    }
}
// deleteMany();



