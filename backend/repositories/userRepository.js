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
