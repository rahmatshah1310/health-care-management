let path = require("path");
require("dotenv").config();

let createError = require("http-errors");
let express = require("express");
const cors = require("cors");

const { testConnection: sequelizeConnection } = require("./config/sequelize");
const session = require("express-session");
const { error } = require("console");

var app = express();

sequelizeConnection();

app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.json({ limit: "1mb" }));

app.use(cors());

app.use(
  session({
    secret: " secret2026",
    resave: false,
    saveUninitialized: false,
  }),
);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Health Care Management" });
});

app.use(function (req, res, next) {
  next(createError);
});

app.use((req, res, next) => {
  console.error(error.message || "Page Not Found");
  throw new Error("Page Not Found");
});

process.on("SIGINT", async () => {
  process.exit(0);
});

module.exports = app;
