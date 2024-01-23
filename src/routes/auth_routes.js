const express = require('express');
//importerar jwt
const jwt = require('jsonwebtoken');
//importerar crypto
const crypto = require('crypto');
//skapar en router
const router = express.Router();
//hämtar secret key från .env filen
const secretKey = process.env.SECRET_KEY;
//skriver ut secret key
console.log(`SecretKey: ${secretKey}`);

require('dotenv').config();

// Fördefinierade användare men skriver inte lösenord och användanamn i koden utan i .env filen som döljs i .gitignore
const users = [
  { email: process.env.USER1_EMAIL, password: process.env.USER1_PASSWORD },
  { email: process.env.USER2_EMAIL, password: process.env.USER2_PASSWORD },
  { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
];

/**
 * parameter email används för att jämföra med användarens e-post och parameter password används för att jämföra med användarens lösenord.
 * @param {string} email Användarens e-post.
 * @param {string} password Användarens lösenord.
 * @returns {boolean} Sant om användaren är giltig, annars falskt.
 */

//kollar om användaren är giltig genom att jämföra e-post och lösenord
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

// Login route med JWT som skickas tillbaka som JSON
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Kontrollera om användaren är giltig och sätt en gräns för giltighetstiden på 1 timme
  if (isValidUser(email, password)) {
    const payload = {
      email,
      role: getUserRole(email),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 timme (3600 sekunder)
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

