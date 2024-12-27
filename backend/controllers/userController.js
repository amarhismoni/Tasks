const Router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const SECRET_KEY = "secret";

Router.post("/register", express.urlencoded(), (req, res) => {
    const fullname = req.body.fullname;
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);

    const user = userRepository.createUser(fullname, username, password);

    res.status(201).json({
        success: true,
        message: "User created successfully!",
    });
});

Router.post("/login", express.urlencoded(), (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = userRepository.findUser(username, password);

    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid Credentials",
        });
    } else {
        const payload = {
            id: user.id,
            username: user.username,
            password: user.password,
        };
        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: "1h",
        });
        res.json({ token });
        console.log(token)
    }
});

module.exports = Router;
