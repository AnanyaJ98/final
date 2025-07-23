const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const crypto = require('crypto');
const transporter = require('../utils/mailer'); // ✅ Import from mailer.js

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validations
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: 'Email already exists' });

  // Create verification token
  const token = crypto.randomBytes(32).toString('hex');

  // Save user to DB
  // const newUser = new User({ name, email, password, verificationToken: token });
  const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds is standard
const newUser = new User({ name, email, password: hashedPassword, verificationToken: token });

  await newUser.save();

  // Send verification email
  const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your MoneyWise Account',
    html: `<h3>Welcome to MoneyWise, ${name}!</h3>
           <p>Please click the link below to verify your email:</p>
           <a href="${verificationLink}">Verify Email</a>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ msg: 'Signup successful! Check your email for verification.' });
  } catch (err) {
    console.error("❌ Email sending error:", err);
    res.status(500).json({ msg: 'Signup failed. Could not send verification email.' });
  }
});
// ✅ Email Verification Route
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send('Invalid or expired verification link.');
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear token after use
    await user.save();

    // Redirect to thank-you page (served from /public/thank-you.html)
    res.redirect('/thank-you.html');
  } catch (err) {
    console.error('❌ Verification error:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
