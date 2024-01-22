const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();
const secretKey = process.env.SECRET_KEY;

console.log(`SecretKey: ${secretKey}`);

// Fördefinierade användare
const users = [
  { email: "user@example.com", password: "password" },
  { email: "miwa@example.com", password: "password" },
  { email: "admin@example.com", password: "password" },
];

/**
 * Kontrollerar om användaren är giltig.
 * @param {string} email Användarens e-post.
 * @param {string} password Användarens lösenord.
 * @returns {boolean} Sant om användaren är giltig, annars falskt.
 */
function isValidUser(email, password) {
  return users.some(user => user.email === email && user.password === password);
}

/**
 * Hämtar användarens roll baserat på e-postadressen.
 * @param {string} email Användarens e-post.
 * @returns {string} Användarens roll ('admin' eller 'user').
 */
function getUserRole(email) {
  return email === 'admin@example.com' ? 'admin' : 'user';
}

// Login-route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (isValidUser(email, password)) {
    const payload = {
      email,
      role: getUserRole(email),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 timme (3600 sekunder)
    };

    const token = jwt.sign(payload, secretKey);
    console.log(`Generated JWT: ${token}`);
    console.log('You are now logged in!');

    res.json({ token });
  } else {
    console.log('Invalid email or password');
    res.status(401).json({ error: 'Invalid login' });
  }
});

module.exports = router;
