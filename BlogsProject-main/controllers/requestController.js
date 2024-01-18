const Blogs = require("../models/Blogs");
const Requests = require("../models/Requests");

exports.getRequests = async (req, res) => {
  try {
    const blogsReq = await Requests.find()
      .populate("user")
      .populate("blogs")
      .exec();

    if (!blogsReq) {
      return res.json({
        sucess: false,
        message: "No requests available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request fetched",
      blogs: blogsReq,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Error in fetching requests",
      error: error.message,
    });
  }
};

exports.sendResponse = async (req, res) => {
  try {
    const { id, status } = req.query;

    const blogRequest = await Requests.findById(id);

    if(status==="Approved"){
        const approvedBlog = await Blogs.findByIdAndUpdate(
            blogRequest.blogs,
            {status:status}
          ).populate("user").exec();      
        await Requests.findByIdAndDelete(id);
    }

    if(status==="Rejected"){
        const rejectedBlog = await Blogs.findByIdAndDelete(blogRequest.blogs);
        await Requests.findByIdAndDelete(id);
    }

    return res.status(200).json({
      success: true,
      message: "Sent Response",
      response: id,
      status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Send Response",
      error: error.message,
    });
  }
};
