const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const port = process.env.PORT || 3000;
const app = express();
// const cors = require("cors");
const { v4: uuid } = require("uuid");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
    // cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    // Error character as . / - ....
    // cb(null, new Date().toISOString() + "-" + file.originalname);
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null, uuid() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// app.use(cors());
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-access-token");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://mongo-user:min03041999@cluster-mongo-test.w8oqhwn.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then((result) => {
    // app.listen(8080);
    // console.log("Server is running on PORT 8080");

    const server = app.listen(port);
    console.log("Server is running on PORT 8080");
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log(socket.adapter.rooms);
    });
  })
  .catch((err) => console.log(err));
