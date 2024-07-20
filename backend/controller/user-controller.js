const User = require("../models/usersmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    // const user=await User.create({
    //     name:req.body.text,
    //     mobile:req.body.number,
    //     email:req.body.email,
    //     password:req.body.pswd
    // })
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !password || !mobile) {
      res.status(400);
      throw new Error("please add all fields");
    }
    // checking user exist or not
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("user already exists");
    }
    //hash Password below
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //create new user
    const user = await User.create({
      name,
      mobile,
      email,
      password: hashPassword,
    });

    if (user) {
      //const token = await generateToken(user)
      //console.log(token);
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("invalid user data");
    }

    //res.status(200).json({message:'new user has been registered'})
  } catch (error) {
    console.log(error.message);
  }
};
const loginpage = async (req, res) => {
  try {
    res.status(200).json({ message: "here comes user login page" });
  } catch (error) {
    console.log(error.message);
  }
};
const userlogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      //const token =  generateToken(user)

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "invalid user credentials" });
      //throw new Error('invalid user credentials')
    }
    // if(!req.body.text)
    // {
    //    // res.status(400).json({message:"please add a text field"})
    //    res.status(400)
    //    throw new Error('please add a text field')
    // }
    // const user=await User.create({
    //     name:req.body.text,
    //     mobile:req.body.number,
    //     email:req.body.email,
    //     password:req.body.pswd
    // })
    // res.status(200).json({message:'here a user gets loggedin here'})
    //res.status(200).json(user)
  } catch (error) {
    console.log(error.message);
  }
};
const homepage = async (req, res) => {
  try {
    const user = await User.find();
    //res.status(200).json({message:'user home page'})
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};

//generate Jwt
const generateToken = (id) => {
  console.log(id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const profile = async (req, res) => {
  try {
    const { _id, name, email, mobile, image } = await User.findById(
      req.user.id
    );

    res
      .status(200)
      .json({
        message: "user profile page is here",
        id: _id,
        name,
        email,
        mobile,
        image,
      });
  } catch (error) {
    console.log(error.message);
  }
};
const editProfile = async (req, res) => {
  try {
    console.log("edit-pro here");
    const user = await User.findById(req.user.id);
    console.log(user, "hello user");
    if (user) {
      user.name = req.body.name;
      user.mobile = req.body.mobile;
      user.email = req.body.email;

      if (req.file) {
        user.image = req.file.filename;
        console.log(user.image, "image");
      }

      const updatedUser = await user.save();
      console.log(updatedUser, "updateduser");
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        mobile: updatedUser.mobile,
        email: updatedUser.email,
        image: updatedUser.image,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  userlogin,
  loginpage,
  homepage,
  registerUser,
  profile,
  userLogout,
  editProfile,
};
