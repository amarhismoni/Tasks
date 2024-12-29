const { Users } = require("../models/model");

exports.findUserByUsername = async (username) => {
    try {
        const user = await Users.findOne({
            where: { username: username },
        });
        return user;
    } catch (error) {
        console.error("Error in findUserByUsername:", error);
        throw error;
    }
};

exports.createUser = async (fullname, username, password) => {
    try {
        const newUser = await Users.create({ fullname, username, password });
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
