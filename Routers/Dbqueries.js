const express = require("express");
const mongoose = require("mongoose");
const home = require("../Models/login");
const Profile = require("../Models/profile");
const dbRouter = express.Router();

dbRouter.get("/", (req, res, next) => {
  res.sendFile(path.join("ConnectNGO", 'Front End', 'index.html'));
})

//====================LOGIN AND SIGNUP====================
dbRouter.post("/signup", async (req, res) => { 
  const { email, password } = req.body;
    
    // Check if user already exists
  const existingUser = await home.findOne({ email });
    
  if (existingUser) {
      return res.json({ message: "Already Exists" });
  }
  else {
    const signupData = new home({ email, password });
    signupData.save().then(user => {
      if (user) {
          res.json({ message: "Success" });
      }
      else {
        res.json({ message: "Failed" });
      }
    }).catch(err => {
        console.log("Error:", err);
        res.status(500).json({ message: "Server error" });
      });
  }

});

dbRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  home.findOne({ email, password })
    .then(user => {
      if (user) {
        console.log(user);
        res.json({ message: "Success", userId: user._id });
      } else {
        res.json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({ message: "Server error" });
    });
});

//====================PROFILE========================

dbRouter.post("/profile", async (req, res) => {
  const { userId, field, value } = req.body;
  let objid = new mongoose.Types.ObjectId(userId);
  if (field !== "experience") {
    const update = await Profile.findOneAndUpdate({ userId: objid }, { [field]: value }, { upsert: true, new: true });
    res.json(update);
    console.log("Updated", update);
  }
  else {
    const update = await Profile.findOneAndUpdate({ userId: objid }, { $push: { [field]: value } }, { upsert: true, new: true });
    res.json(update);
    console.log("Updated", update);
  }
});

// dbRouter.post("/profile", async (req, res) => {
//   console.log("here");
//   const { userId, field, value } = req.body;
//   let objid = new mongoose.Types.ObjectId(userId);
//   const update = await Profile.findOneAndUpdate({ userId: objid }, { $push: { [field]: value } }, { upsert: true, new: true });
//   res.json(update);
//   console.log("Updated", update);
// });


module.exports = dbRouter;