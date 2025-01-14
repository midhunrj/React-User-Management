const express=require("express")
const cors=require('cors')
const dotenv=require('dotenv').config()
const port=process.env.PORT
console.log(port);
const {errorHandler}=require('./middleware/errormiddleware')
const connectDB=require('./database/dbconfig')
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
console.log("hello world")
const userroute=require('./routes/user-router')
const adminroute=require('./routes/admin-router')
connectDB()
app.use('/uploads', express.static('uploads'));
app.use('/',userroute)
app.use('/admin',adminroute)
app.use(errorHandler)
app.listen(port,()=>console.log(`server started running \n http://localhost:${port}`))