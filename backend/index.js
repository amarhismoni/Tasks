const express = require("express");
const app = express();
const userController = require("./controllers/userController");
const cors = require('cors')

app.use(
    cors({
        origin: "http://localhost:3001",
        preflightContinue: true,
    })
);


app.use('/auth', userController );

app.listen(3000);

