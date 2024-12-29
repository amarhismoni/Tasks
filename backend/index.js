const express = require("express");
const app = express();
const userController = require("./controllers/userController");
const cors = require('cors')
const passport = require("passport");
const taskController = require("./controllers/taskController")
require("./config/passport");

app.use(passport.initialize)

app.use(
    cors({
        origin: "http://localhost:3000",
        preflightContinue: true,
    })
);


app.use("/auth", userController);
app.use("/tasks", taskController);

app.listen(8585);

