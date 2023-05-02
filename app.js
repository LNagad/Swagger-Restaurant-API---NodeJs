const express = require("express");

const { authenticateDb } = require("./database/authenticateDb");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const ingredientsRoute = require("./routes/ingredients");
const dishesRoute = require("./routes/dishes");
const tablesRoute = require("./routes/tables");
const ordersRoute = require("./routes/orders");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Restaurant API",
      version: "1.0.0",
    },
  },
  securityDefinitions: {
    bearerAuth: {
      type: "bearer",
      name: "Authorization",
      in: "header",
      example:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    },
  },
  apis: ["./routes/auth.js", "./routes/dishes.js", "./routes/orders.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
