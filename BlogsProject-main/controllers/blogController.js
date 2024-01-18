const Blogs = require("../models/Blogs");
const User = require("../models/User");
const { default: axios } = require("axios");
const Requests = require("../models/Requests");

exports.getBlogs = async (req, res) => {
  try {
    const { name } = req.query;
    const userToSearch = await User.findOne({ name });


    if (!userToSearch) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    const blogsForUser = await Blogs.find({user:userToSearch._id ,status:"Approved"});

    if (!blogsForUser || blogsForUser.length==0) {
      return res.json({
        success: false,
        message: "No Blogs Found for Selected User",
      });
    }

    return res.json({
      success: true,
      message: "Blogs Found",
      blogs: blogsForUser,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in finding blogs ",
      error: error.message,
    });
  }
};

exports.showAllBlogs = async (req, res) => {
  try{

    const allBlogs = await Blogs.find({status:"Approved"});

    if(!allBlogs){
      return res.json({
        success:false,
        message:"No blogs Found",
      })
    }

    return res.json({
      success:true,
      message:"Blogs Found",
      blogs:allBlogs
    })
  }
  catch(error){
    return res.json({
      success:false,
      message:"Error",
      error:error.message
    })
  }

};

exports.addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    let status;

    if(req.user.role==="Admin"){
      status = "Approved"
    }
    else{
      status = "Pending"
    }

    const publishedBlog = await Blogs.create({
      user: req.user.id,
      title: title,
      content: content,
      status: status
    });

    if(publishedBlog.status==="Pending"){
      const requests = await Requests.create({
      user:publishedBlog.user,
      blogs:publishedBlog._id
    })}



    const admin = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { $push: { blogs: publishedBlog._id } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Added Blog",
      blog: publishedBlog,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Failed to add Blog",
      error: error.message,
    });
  }
};
