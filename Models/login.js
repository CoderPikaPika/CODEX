const mongoose = require("mongoose");
const schema=mongoose.Schema({

    email:{
        type: String
    },
    password:{
        type: String
    }
})

const Home=mongoose.model("Home",schema);

module.exports=Home;