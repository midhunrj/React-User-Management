const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()


const connectDB=async(req,res)=>{
    try{
          console.log(process.env.mongodb);    
     await mongoose.connect(process.env.mongodb)
     console.log("Mongodb connected");
return
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports=connectDB