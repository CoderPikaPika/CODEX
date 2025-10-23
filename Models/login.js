const mongoose = require("mongoose");
const schema=mongoose.Schema({

    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

const Home=mongoose.model("Home",schema);

module.exports=Home;