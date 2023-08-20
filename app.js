require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer')

const { authenticateDb } = require("./database/authenticateDb");

const authRoutes = require("./routes/auth");
const ingredientsRoute = require("./routes/ingredients");
const dishesRoute = require("./routes/dishes");
const tablesRoute = require("./routes/tables");
const ordersRoute = require("./routes/orders");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Configurar multer
const upload = multer().single('img');

app.use((req, res, next) => {
  upload(req, res, (err) => {
  
    next();
  });
});

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
app.use(ingredientsRoute);
app.use(dishesRoute);
app.use(tablesRoute);
app.use(ordersRoute);

app.use((error, req, res, next) => {
  //TODO: Log the error to a file or database

  console.log(error);

  const message = error?.message;

  const statusCode = error.statusCode || 500;

  const data = error?.data;

  res.status(statusCode).json({ message, data, statusCode });
});

const PORT = process.env.PORT || 3000;
authenticateDb()
  .then(() => {
    app.listen(PORT);

    console.log("Server is listenning on port " + PORT);
  })
  .catch((error) => {
    console.log(error);
  });
