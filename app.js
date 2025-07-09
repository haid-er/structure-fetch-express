require("dotenv").config();
const express = require("express");
const routes = require("./src/routes/index.route");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const notFound = require("./src/middlewares/notFound.middleware");
const errorHandler = require("./src/middlewares/errorHandler.middleware");
const { requestLogger } = require("./src/middlewares/logger.middleware");
const connectDB = require("./src/db");
const { CORS_ORIGIN, PORT } = process.env;
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(requestLogger);
app.use("/", routes);
app.use(notFound);
app.use(errorHandler);
connectDB();
app.listen(PORT || 3000, function () {
  console.log(`Server is listening on port 3000`);
});
module.exports = app;

