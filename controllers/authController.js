const User= require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Generation of token
const generateToken = (userId) => {
    return jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:'7d',
    });
};

//@route  POST/api/auth/signup
//@desc Register a new user
exports.signup = async(req,res) => {
    try{
        let{name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:'Please provide name, email and password'});
        };

        email=email.toLowerCase();

        //VALIDATE USER EXISTENCE
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'Email is already registered'})
        }

       //HASH PASSWORD
       const hashedPassword = await bcrypt.hash(password,10);

       //CREATE USER
       const user=await User.create({name,email,password:hashedPassword});

       res.status(201).json({
        token:generateToken(user._id),
        user:{id:user._id,name:user.name,email:user.email},
       });
    } catch(err){
        res.status(500).json({message:'Server during signup'});

    }
};


// @route   POST /api/auth/login
// @desc    Login user and return token
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    email = email.toLowerCase(); // normalize email

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

