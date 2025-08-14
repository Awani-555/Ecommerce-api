const jwt = require('jsonwebtoken');
const User=require('../models/User');

const protect = async (req,res,next) =>{
    try{
        //CHECK IF AUTHORIZATION HEADER IS PRESENT AND STARTS WITH 'BEARER'
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
        }

        //EXTRACK TOKEN FROM HEADER
        const token = authHeader.split(' ')[1];

        //VERIFY TOKEN USING JWT_SECRET
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        //FIND USER BY ID FROM DECODED TOKEN
        const user =await User.findById(decoded.id).select('-password');

        //CHECK IF USER STILL EXISTS
        if(!user){
             return res.status(401).json({ message: 'User does not exists' });
        }
        req.user=user;
        next();


    }
    catch(err){

        //HANDLING TOKEN ERRORS
          if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });

    }

};

module.exports = protect;
