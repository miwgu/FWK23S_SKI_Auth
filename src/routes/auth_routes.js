const express = require('express');
//importerar jwt
const jwt = require('jsonwebtoken');
//importerar crypto för att skapa en secret key
const crypto = require('crypto');
//importerar bcrypt för att hasha lösenord
const bcrypt = require('bcrypt'); 
//skapar en router
const router = express.Router();
//hämtar secret key från .env filen
const secretKey = process.env.SECRET_KEY;

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

