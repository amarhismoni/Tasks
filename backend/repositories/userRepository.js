const { Users } = require("../models/model");

exports.createUser = async (fullname, username, password, resetToken) => {
    try {
        console.log("Password:", password);
        console.log("Reset Token:", resetToken);
        const newUser = await Users.create({ fullname, username, password, resetToken });
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

const bcrypt = require("bcrypt");

exports.changeUserPassword = async (id, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [updated] = await Users.update(
            { password: hashedPassword },
            {
                where: {
                    id: id,
                },
            }
        );

        if (updated) {
            return true;
        } else {
            throw new Error("User not found or password not updated.");
        }
    } catch (error) {
        console.error("Error in changeUserPassword:", error);
        throw error;
    }
};
exports.verifySecretAnswer = async (username, secretAnswer) => {
    try {
        const user = await Users.findOne({
            where: {
                username: username,
            },
        });

        if (!user) {
            throw new Error("User not found.");
        }


        const comparedSecretAnswer = await bcrypt.compare(secretAnswer, user.resetToken)

        if (comparedSecretAnswer) {
            return user; 
        } else {
            throw new Error("Invalid secret answer.");
        }
    } catch (error) {
        console.error("Error in verifySecretAnswer:", error);
        throw error;
    }
};
