const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const SECRET_KEY = "secret";

// Register Route
Router.post("/register", express.urlencoded({ extended: true }), async (req, res) => {

    const { fullname, username, password } = req.body;

    try {
        const foundUser = await userRepository.findUserByUsername(username);

        if (foundUser) {
            return res.status(409).json({
                success: false,
                message: "User-i eksiston, shtoni nje tjeter",
            });
        }

        const user = await userRepository.createUser(fullname, username, password);

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
Router.post("/login", express.urlencoded({ extended: true }), (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username dhe passwordi duhet te vendosen.",
        });
    }

    const user = userRepository.findUserByUsername(username);
    if (!user || user.password !== password) {
        return res.status(401).json({
            success: false,
            message: "Kredenciale te gabuara.",
        });
    }

    const payload = {
        id: user.id,
        username: user.username,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    return res.json({
        success: true,
        message: "Keni hyr me sukses.",
        token,
    });
});

module.exports = Router;
