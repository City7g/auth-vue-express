const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 80

const verifyToken = require("./routes/verifyToken");

dotenv.config();

mongoose.connect(
  'mongodb+srv://Dima:2010dimaD@cluster0.4gspp.mongodb.net/User?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connect to db");
  }
);

app.use(express.json());

const authRoute = require("./routes/auth");

app.use("/api/user", authRoute);

app.get("/posts", verifyToken, (req, res) => {
  res.send(req.user)
});

app.listen(PORT, () => {
  console.log("Server starting");
});