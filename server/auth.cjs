
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db.cjs');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    // Create JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (typeof email === 'string') email = email.trim();
    if (typeof password === 'string') password = password.trim();
    console.log('Login attempt for', email);

    // Check if user exists and load profile data
    const result = await db.query(
      `SELECT u.*, p.role, p.hotel_id, p.name
       FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.email = $1`,
      [email]
    );
    console.log('User query result', result.rows);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    // Sanitize values in case seed data contains trailing whitespace
    if (user.password_hash) {
      user.password_hash = user.password_hash.trim();
    }
    if (user.role) {
      user.role = user.role.trim();
    }
    console.log('Comparing password for', user.email, 'hash', user.password_hash);

    // Ensure password hash exists before comparing
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match?', isMatch);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hotel_id: user.hotel_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
