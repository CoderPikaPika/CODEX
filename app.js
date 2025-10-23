const express = require("express");
const app = express();
const mongoose = require("mongoose");
const url ="mongodb+srv://db1:FirstDatabase@cluster1.yl2waiq.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster1";
const PORT = 3000;
const dbRouter=require("./Routers/Dbqueries");

app.use(express.static('Front End'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(dbRouter);


mongoose.connect(url).then(() => {
  console.log("Connected to Mongo");
  app.listen(PORT,() => {
    console.log("Server Created.");
  });
});