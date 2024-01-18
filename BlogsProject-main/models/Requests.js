const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    blogs:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blogs"
    }
})

requestSchema.set('strictPopulate', false);

module.exports = mongoose.model("Requests",requestSchema);