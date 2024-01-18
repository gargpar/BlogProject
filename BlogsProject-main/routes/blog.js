const express = require("express");
const router = express.Router();

const {showAllBlogs, addBlog, getBlogs} = require("../controllers/blogController");
const{auth} = require("../middleware/auth");
const{getRequests,sendResponse} = require("../controllers/requestController");

router.post("/addBlog",auth,addBlog);
router.get("/getBlogs",getBlogs);
router.get("/showAllBlogs",showAllBlogs);

router.get("/getReq",getRequests);
router.post("/sendRes",sendResponse)



module.exports = router