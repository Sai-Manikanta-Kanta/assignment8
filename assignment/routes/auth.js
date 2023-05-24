const express = require('express');
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   const User = require('../models/userSchema.js');

   const router = express.Router();

   // Register new user
   router.post('/register', async (req, res) => {
     try {
       const { name, email, password } = req.body;
       const existingUser = await User.findOne({email:email });

       if (existingUser) {
         return res.status(409).json({ error: 'User already exists' });
       }

       const hashedPassword = await bcrypt.hash(password, 10);
       const user = new User({ name:name, email:email, password: hashedPassword });
       await user.save();

       res.status(201).json({ message: 'User registered successfully' });
     } catch (error) {
       res.status(500).json({ error: 'Internal server error' });
     }
   });

   // User login
   router.post('/login', async (req, res) => {
     try {
       const { email, password } = req.body;
       const user = await User.findOne({email: email });

       if (!user) {
         return res.status(401).json({ error:'Invalid email or password' });
       }

       const isPasswordValid = await bcrypt.compare(password, user.password);

       if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid email or password' });
       }

       const token = jwt.sign({ userId: user._id }, 'Manikanta', { expiresIn: '1h' });
       res.status(200).json({ token });
     } catch (error) {
       res.status(500).json({ error: 'Internal server error' });
     }
   });

   module.exports = router;