const { Users } = require("../models/model");

exports.createUser = async (fullname, username, email, password) => {
    try {
        console.log(password)
        const newUser = await Users.create({ fullname, username, email, password });
        return newUser;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw error;
    }
};

exports.findUserByUsername = async (username) => {
    try {
        const user = await Users.findOne({
            where: {
                username: username,
            },
        });
        return user || null; 
    } catch (error) {
        console.error("Error finding user by username:", error);
        throw error;
    }
};
