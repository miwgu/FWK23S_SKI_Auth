const express = require('express');
//importerar jwt
const jwt = require('jsonwebtoken');
//importerar crypto
const bcrypt = require('bcrypt'); // för att hasha lösenord
//skapar en router
const router = express.Router();
//hämtar secret key från .env filen
const secretKey = process.env.SECRET_KEY;
//skriver ut secret key
console.log(`SecretKey: ${secretKey}`);

require('dotenv').config();



// Fördefinierade användare men skriver inte lösenord och användanamn i koden utan i .env filen som döljs i .gitignore
const users = [
  { email: process.env.USER1_EMAIL, passwordHash: process.env.USER1_PASSWORD_HASH },
  { email: process.env.USER2_EMAIL, passwordHash: process.env.USER2_PASSWORD_HASH },
  { email: process.env.ADMIN_EMAIL, passwordHash: process.env.ADMIN_PASSWORD_HASH },
];

/**
 * parameter email används för att jämföra med användarens e-post och parameter password används för att jämföra med användarens lösenord.
 * @param {string} email Användarens e-post.
 * @param {string} password Användarens lösenord.
 * @returns {boolean} Sant om användaren är giltig, annars falskt.
 */

//kollar om användaren är giltig genom att jämföra e-post och lösenord
function isValidUser(email, password) {
  const user = users.find(user => user.email === email);
  if (!user) {
    return false; // Användaren finns inte
  }
  
  // Jämför det inkommande lösenordet med det hashade lösenordet
  return bcrypt.compareSync(password, user.passwordHash);
}
/**
 * Hämtar användarens roll baserat på e-postadressen.
 * @param {string} email Användarens e-post.
 * @returns {string} Användarens roll ('admin' eller 'user').
 */
function getUserRole(email) {
  return email === 'admin@example.com' ? 'admin' : 'user';
}

// Login route med JWT som skickas tillbaka som JSON
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user is valid and set the expiration time based on the user role
    if (isValidUser(email, password)) {
      const userRole = getUserRole(email);
      let expirationTime;

    // Set expiration time based on user role
      if (userRole === 'admin') {
      // Admin users have a 1-hour expiration time
      expirationTime = 60 * 60; // 1 hour in seconds
    } else {
      // Regular users have a 30-secound expiration time.
      expirationTime = 30; // 30 secound.
      }

    // Create payload with user information and expiration time
    const payload = {
      email,
      role: userRole,
      exp: Math.floor(Date.now() / 1000) + expirationTime,
    };
  
  // Skapa och signera JWT med vår hemliga nyckel och skicka tillbaka den som JSON
    const token = jwt.sign(payload, secretKey);
    console.log(`Generated JWT: ${token}`);
    console.log('WELCOME! You are now logged in!');
  // om användaren inte är giltig skickas ett felmeddelande tillbaka
    res.json({ token });
  } else {
    console.log('Invalid email or password');
    res.status(401).json({ error: 'Invalid login' });
  }
});

// Exportera modulen för att kunna användas av andra moduler (t.ex. server.js) via require() funktionen 
module.exports = router;

