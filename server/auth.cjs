
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db.cjs');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable not set');
}

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, hotel_id } = req.body;
    
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
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    await db.query(
      'INSERT INTO profiles (user_id, name, role, hotel_id) VALUES ($1, $2, $3, $4)',
      [result.rows[0].id, name || '', role || 'client', hotel_id || null]
    );

    const userObj = {
      id: result.rows[0].id,
      email,
      name: name || '',
      role: role || 'client',
      hotel_id: hotel_id || null
    };

    const token = jwt.sign(
      { id: userObj.id, role: userObj.role, hotel_id: userObj.hotel_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: userObj });
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
       LEFT JOIN profiles p ON u.id = p.user_id
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

    // Reload profile details if missing (legacy seeds may not join correctly)
    if (!user.role || !user.name) {
      const profRes = await db.query(
        'SELECT name, role, hotel_id FROM profiles WHERE user_id = $1',
        [user.id]
      );
      if (profRes.rows.length > 0) {
        user.name = profRes.rows[0].name;
        user.role = profRes.rows[0].role;
        user.hotel_id = profRes.rows[0].hotel_id;
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, hotel_id: user.hotel_id },
      process.env.JWT_SECRET,
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
