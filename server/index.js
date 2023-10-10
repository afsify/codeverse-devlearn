require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const CORS = require("cors");
const express = require("express");
const app = express();
const adminRouter = require("./router/admin.router");
const userRouter = require("./router/user.router");
const session = require("express-session");
const connectDB = require("./config/database");
connectDB();

app.use(
  CORS({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type,Authorization"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: "key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is Running on Port ${port}`));
