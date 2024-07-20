const { type } = require('@testing-library/user-event/dist/type')
const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"please add a text value"]
    },
    mobile:{
        type:Number,
        required:[true,"please add a 10 digit number"]
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:'empty-dp.jpeg'
    }

})

module.exports=mongoose.model('User',userSchema)