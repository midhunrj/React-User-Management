const express=require('express')
const user_route=express()
const path=require('path')
const jwt=require('jsonwebtoken')

const UserController=require('../controller/user-controller')

const {upload}=require('../multer/multer')
const auth=require('../middleware/authMiddleware')
user_route.post('/signup',UserController.registerUser)
user_route.get('/',UserController.loginpage)
user_route.post('/login',UserController.userlogin)
user_route.get('/home',UserController.homepage)
user_route.get('/profile',auth.protected,UserController.profile)
user_route.post('/edit-profile',auth.protected,upload.single('image'),UserController.editProfile)
//user_route.get('/logout',UserController.userLogout)
// user_route.get('/',UserController)
// user_route.get('/',UserController)


module.exports=user_route