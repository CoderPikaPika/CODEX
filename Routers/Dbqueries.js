const express=require("express");
const home=require("../Models/login");
const dbRouter=express.Router();

dbRouter.get("/",(req,res,next)=>{
    res.sendFile(path.join("ConnectNGO", 'Front End', 'index.html'));
})

dbRouter.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const signupData=new home({email, password});
  signupData.save().then(user => {
      if (user) {;
        res.json({ message: "Success" });
      } else {
        res.json({ message: "Failed" });
      }
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({ message: "Server error" });
    });
});

dbRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  home.findOne({ email, password })
    .then(user => {
      if (user) {
        res.json({ message: "Success" });
      } else {
        res.json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({ message: "Server error" });
    });
});

module.exports=dbRouter;