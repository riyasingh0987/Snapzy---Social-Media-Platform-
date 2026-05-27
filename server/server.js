// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database and ensure demo account exists
const createDemoUser = async () => {
  try {
    const demoEmail = 'demo@demo.com';
    const existingDemoUser = await User.findOne({ email: demoEmail });

    if (!existingDemoUser) {
      const salt = await bcrypt.genSalt(10);
      const demoPassword = 'DemoPass123!';
      const hashedPassword = await bcrypt.hash(demoPassword, salt);

      await User.create({
        username: 'demouser',
        email: demoEmail,
        fullName: 'Demo User',
        password: hashedPassword,
        bio: 'Demo user account for quick login.'
      });

      console.log(`Demo user created: ${demoEmail} / ${demoPassword}`);
    }
  } catch (error) {
    console.error('Demo user creation error:', error.message);
  }
};

connectDB().then(createDemoUser);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
