const mongoose = require("mongoose");

const experienceSchema=new mongoose.Schema({
    designation:{ type: String ,required: true },
    startDate: { type: Date, required: true },
    endDate:{type: Date},
    description: { type: String, required: true }

})
const schema=mongoose.Schema({

     userId:{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true
    },
    about:{
        type: String,
    },

    experience: [experienceSchema]
})

const Profile=mongoose.model("Profile",schema);


module.exports=Profile; 