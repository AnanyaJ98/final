// const express = require('express');
// const app = express(); // ✅ THIS LINE IS MISSING
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');
// const authRoutes = require('./routes/auth');

// dotenv.config();

// app.use(express.json());
// app.use(express.static(path.join(__dirname, '../public')));

// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('✅ MongoDB Connected');
// }).catch((err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

const express = require('express');
const app = express(); // ✅ Now defined
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth'); // ✅ Assuming route exists

dotenv.config(); // ✅ Loads .env before anything else

// Middleware
app.use(express.json()); // ✅ Parses JSON requests
app.use(express.static(path.join(__dirname, '../public'))); // ✅ Serves signup.html, images, etc.

// Routes
app.use('/api/auth', authRoutes); // ✅ Signup route (POST /api/auth/signup)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
