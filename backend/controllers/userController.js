const Router = require("express").Router()
const express = require("express")
const userRepository = require("../repositories/userRepository")

Router.post('/register', express.urlencoded(), (req,res)=>{
    const fullname = req.body.fullname;
    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    

    const user = userRepository.createUser(fullname, username, password)

    res.status(201).json({
        success: true,
        message: "User created successfully!"
    })
})

module.exports = Router