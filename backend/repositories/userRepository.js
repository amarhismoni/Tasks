const model = require("../models/model");
const user = model.Users;

exports.createUser = async (fullname, username, password) => {
    try {
        const newUser = await user.create({
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
