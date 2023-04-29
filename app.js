const express = require("express");

const { authenticateDb } = require("./database/authenticateDb");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  //TODO: Log the error to a file or database

  console.log(error);

  const message = error.message;

  const statusCode = error.statusCode || 500;

  const data = error.data;

  res.status(statusCode).json({ message, data });
});

const PORT = 3000;
authenticateDb()
  .then(() => {
    app.listen(PORT);

    console.log("Server is listenning on port " + PORT);
  })
  .catch((error) => {
    console.log(error);
  });
