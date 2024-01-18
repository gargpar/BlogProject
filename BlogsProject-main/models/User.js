const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    blogs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blogs"
    }],
    role:{
        type:String,
        enum:["Admin","User"],
        required:true
    },
    token:{
        type:String
    }
})

module.exports = mongoose.model("User",userSchema);