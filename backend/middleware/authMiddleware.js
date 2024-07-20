// const jwt=require('jsonwebtoken')
// const User=require('../models/usersmodel')

// const protected=async(req,res,next)=>{
//     let token
// if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer'))
// {
//     try{
//         console.log("it is protected");
//         token=req.headers.authorization.split(' ')[1]
        
//         const decoded=jwt.verify(token,process.env.JWT_SECRET)

//         req.user=await User.findById(decoded.id).select('-password')
//       console.log("goes to next middlware");
//         next()
//     }
//     catch(error)
//     {
//         console.log(error.message);
//         res.status(401).json({message:'Not Authorized'})
//         //throw new Error('Not Authorized')
//     }
// }
// else
// {
//     res.status(401).json({message:'not authorized,no token'})
//     //throw new Error('not authorized,no token')
// }
// }
// module.exports={protected}

const jwt = require('jsonwebtoken');
const User = require('../models/usersmodel');

const protected = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            console.log("Authorization header found:", req.headers.authorization);
            token = req.headers.authorization.split(' ')[1];
            console.log("Extracted token:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            console.log("Authenticated user:", req.user);

            next();
        } catch (error) {
            console.log("Token verification error:", error.message);
            return res.status(401).json({ message: 'Not authorized, token invalid' });
        }
    } else {
        console.log("No token provided");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protected };
