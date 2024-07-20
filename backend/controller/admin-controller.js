const User=require('../models/usersmodel')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()
const loginpage=async(req,res)=>{
    try{
        res.status(200).json({message:'here comes login page for admin to sneak in'})
    }
    catch(error)
    {
        console.log(error.message);
    }
}
const adminlogin=async(req,res)=>{
    try{
        const{email,password}=req.body
        const adminmail=process.env.Admin_mail
        const adminpass=process.env.Admin_pass
        if(email===adminmail)
        {
            if(password===adminpass)
            {
              const admintoken=await generateToken(email)
              console.log("last belly");
              res.json(admintoken)
            }
            else{
                res.status(400).json({message:'password wrong'})
            }
        }
        else{
            res.status(400).json({message:'email is not correct'})
        }
        //res.status(200).json({message:'here admin gets logged in here again'})
    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).json(error.message)
    }
}
const homepage=async(req,res)=>{
    try{
        const users=await User.find()
        console.log("users are traveling");
        res.json(users)
        //res.status(200).json({message:'Its admin baby on home page'})
    }
    catch(error)
    {
        console.log(error.message);
    }
}

const createUser = async (req, res) => {
    try {
        console.log("creating a user");
      const { name, mobile, email, password } = req.body;
  
      
      if (!name || !mobile || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
  
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      
      const newUser = new User({
        name,
        mobile,
        email,
        password: hashedPassword,
      });
  
      
      const savedUser = await newUser.save();
  
    
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: savedUser._id,
          name: savedUser.name,
          mobile: savedUser.mobile,
          email: savedUser.email,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
const updateUser=async(req,res)=>{
    try{
        console.log("update user");
        console.log(req.body,"update user body");
    const {id}=req.params;
    console.log(id,"params");
    const Id=req.body.id
    console.log(req.file,"file");
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        ...(req.file && { image: req.file.filename }), // handle image if exists
      };
      console.log(updatedData,"updatedata");
    // let users=[]
    // users=users.map(user=>user.id===parseInt(id)?updateUser:user)
    const updatedUser=await User.findByIdAndUpdate(Id,
        updatedData,
        {new:true})

        if(!updateUser)
        {
            return res.status(404).json({message:'user not found'})
        }
    res.json(updatedUser) 
   }
    catch(error)
    {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
    
}
const searchUser=async(req,res)=>
{
    try{
        console.log("hello searching user");
        console.log(req.query.search);
const searchQuery = req.query.search|| '';
console.log(`Search query: ${searchQuery}`);
const users = await User.find({
  $or: [
    { name: { $regex: searchQuery, $options: 'i' } },
    { email: { $regex: searchQuery, $options: 'i' } },
   
  ]
});

res.status(200).json(users);
    }
    catch(error)
    {
        console.log(error.message);
    }
}


const deleteUser=async(req,res)=>{
    try{
    const {id}=req.params
    const deletedUser=await User.findByIdAndDelete(id)
    if(!deletedUser)
    {
        return res.status(404).json({message:'user not found'})
    }
    res.json({message:'User deleted successfully'})
    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}
const generateToken=(email)=>{
    console.log(email);
    return  jwt.sign({email},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
    
}
const logout=async(req,res)=>{
    try{
    
    }
    catch(error)
    {
        console.log(error.message);
    }
}
module.exports={
    loginpage,
    adminlogin,
    homepage,
    updateUser,
    deleteUser,
    createUser,
    searchUser
}