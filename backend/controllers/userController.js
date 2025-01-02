const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt")

const SECRET_KEY = "secret";

// Register Route
Router.post("/register", express.urlencoded({ extended: true }), async (req, res) => {

    const { fullname, username, password, secretAnswer } = req.body;
    

    const hashPassword = async (password) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword;
    }

    try {
        const foundUser = await userRepository.findUserByUsername(username);

        if (foundUser) {
            return res.status(409).json({
                success: false,
                message: "User-i eksiston, shtoni nje tjeter",
            });
        }

        const hashedPassword = await hashPassword(password);

        console.log(hashedPassword)

        const user = await userRepository.createUser(fullname, username, hashedPassword, secretAnswer);

        return res.status(201).json({
            success: true,
            message: "Useri u krijua me sukses!",
        });
    } catch (error) {
        console.error("Gabim ne regjistrim:", error);
        return res.status(500).json({
            success: false,
            message: "Kemi nje gabim gjat regjistrimit.",
        });
    }
});


// Login Route
Router.post("/login", express.urlencoded({ extended: true }), async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username dhe passwordi duhet te vendosen.",
        });
    }

    try {
        const user = await userRepository.findUserByUsername(username);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User nuk u gjet.",
            });
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "Kredenciale te gabuara.",
            });
        }

        const payload = {
            sub: user.id, 
            fullname: user.fullname,
            username: user.username,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });


        return res.json({
            success: true,
            message: "Keni hyr me sukses.",
            token,
            user: { id: user.id, fullname: user.fullname, username: user.username },
        });

    } catch (error) {
        console.error("Gabim ne login:", error);
        return res.status(500).json({
            success: false,
            message: "Kemi nje gabim gjate logimit.",
        });
    }
});


Router.post("/password-reset", async (req, res) => {
    const { username, resetToken, newPassword } = req.body;

    try {
        
        const user = await userRepository.verifySecretAnswer(username, resetToken);
       
        await userRepository.changeUserPassword(user.id, newPassword);

        res.json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Password reset error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});
module.exports = Router;
