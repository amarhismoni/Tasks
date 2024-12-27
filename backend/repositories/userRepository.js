const { Users } = require("../models/model");

exports.createUser = async (fullname, username, password) => {
    try {
        const newUser = await Users.create({
            fullname: fullname,
            username: username,
            password: password,
        });
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

exports.findUser = async (username, password) => {
    try {
        const user = await Users.findAll({
            where: {
                username: username,
                password: password
            }
        });
        return user
    } catch (error) {
        console.log("Invalid Credentials")
    }
}
