const express = require("express");
const {join} = require('path');
const router = express.Router();

const{showUsers,showUserData} = require("../controllers/userController");
const{login,signUp} = require("../controllers/Auth");
const{auth,isAdmin, isUser} = require("../middleware/auth");

const path = join(__dirname,"..","static","user.hbs");

router.get('/',(req,res)=>{
  res.render(path);
})

router.get("/showUsers",showUsers);

router.get("/showUserData",auth,showUserData);

router.post("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome Tester"
    })
})

router.post("/login",login);
router.post("/signUp",signUp);

router.get("/student", auth, isUser, (req, res) => {
    res.json({
      success: true,
      message: "Welcome Student",
    });
  });
  
  router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  });

module.exports = router;