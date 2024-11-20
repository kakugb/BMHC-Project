const User = require('../models/user.model.js'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    
    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({ username, email, password: hashedPassword, role });
    
    
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if password matches
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, role: user.role },  // Payload with userId and role
        process.env.JWT_SECRET,                 // Secret key for signing token (store in .env)
        { expiresIn: '1h' }                    // Token expiration (optional)
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,                                 
        role: user.role                        
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
