import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import User from '../backend/models/userModel.js';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware and static files
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public/css')));
app.use(express.static(path.join(__dirname, '../views')));

// Set up multer for resume (or file) uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views', 'login.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, '../views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../views', 'register.html')));
app.get('/jobs.html', (req, res) => res.sendFile(path.join(__dirname, '../views', 'jobs.html')));
app.get('/profile.html', (req, res) => res.sendFile(path.join(__dirname, '../views', 'profile.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, '../views', 'index.html')));

// POST Login – Validates credentials
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Email not found
      return res.send(`
        <script>
          alert('Email not found. Please register first.');
          window.location.href = "/login.html"; 
        </script>
      `);
    }

    if (user.password !== password) {
      // Password incorrect
      return res.send(`
        <script>
          alert('Incorrect password. Please try again.');
          window.location.href = "/login.html"; 
        </script>
      `);
    }

    // On success
    res.send(`
      <script>
        localStorage.setItem("userEmail", "${user.email}");
        window.location.href = "/index.html";
      </script>
    `);
  } catch (err) {
    res.status(500).send('Login error: ' + err.message);
  }
});


// Register New User
app.post('/register', upload.single('resume'), async (req, res) => {
  const { name, email, password, contact, address, role } = req.body;

  try {
    const newUser = new User({
      name,
      email,
      password,
      contact,
      address,
      role,
      resume: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            originalName: req.file.originalname,
          }
        : null,
    });

    await newUser.save();
    // Redirect explicitly to login page after registration
    res.redirect('/login.html');
  } catch (err) {
    res.status(400).send('Registration failed: ' + err.message);
  }
});

// Profile Update Route
app.post('/update-profile', upload.single('resume'), async (req, res) => {
  const { email, name, password, contact, address, role } = req.body;
  const updatedResume = req.file
    ? {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname,
      }
    : null;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update user fields
    user.name = name
    user.password = password 
    user.contact = contact 
    user.address = address 
    user.role = role 

    if (updatedResume) {
      user.resume = updatedResume;
    }

    await user.save();
    res.send(`
      <script>
        alert('Profile updated successfully');
        window.location.href = "/profile.html";
      </script>
    `);
  } catch (err) {
    res.status(500).send('Error updating profile: ' + err.message);
  }
});

// Get user profile by email
app.get('/profile', async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      name: user.name,
      email: user.email,
      password: user.password,
      contact: user.contact,
      address: user.address,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
