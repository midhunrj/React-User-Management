const multer=require('multer')
const path=require('path')
const storage=multer.diskStorage({
    
    destination:(req,file,cb)=>{
         cb(null,path.join(__dirname,'../uploads'))
        console.log(path.join(__dirname,'../uploads'));
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.fieldname}-${Date.now()}${file.originalname}`)
    }

})

// const fileFilter=(req,file,cb)=>{
//     if(file.mimetype==='image/jpeg'||file.mimetype==='image/png')
//     {
//         cb(null,true)
//     }
//     else{
//         cb(null,false)
//     }
// }

const upload=multer({
    
    storage,
    
    // limits:{
    //     fileSize:1024*1024*5
    // },
    // fileFilter
})
console.log(upload,"upload");

module.exports={upload}