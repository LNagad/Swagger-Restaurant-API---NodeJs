const express = require("express");

const { authenticateDb } = require("./database/authenticateDb");

const app = express();

const PORT = 3000;

authenticateDb()
  .then(() => {
    app.listen(PORT);

    console.log("Server is listenning on port " + PORT);
  })
  .catch((error) => {
    console.log(error);
  });
