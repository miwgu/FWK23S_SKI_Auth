const fs = require('fs').promises;
const express = require('express');
//importerar jwt
const jwt = require('jsonwebtoken');
//importerar bcrypt för att hasha lösenord
const bcrypt = require('bcrypt'); 
//skapar en router
const router = express.Router();
//hämtar secret key från .env filen
const secretKey = process.env.SECRET_KEY;

require('dotenv').config();
// Vi har users.json(fake-database)

/**
 * parameter email används för att jämföra med användarens e-post och parameter password används för att jämföra med användarens lösenord.
 * @param {string} email Användarens e-post.
 * @param {string} password Användarens lösenord.
 * @returns {boolean} Sant om användaren är giltig, annars falskt.
 */

//kollar om användaren är giltig genom att jämföra e-post och lösenord
// pausa exekveringen av den funktionen själv tills promise(await) är löst och hämta resultatet av promise(await).
async function isValidUser(email, password) {
  try {
    // Läs innehållet från filen './data/users.json' som en textsträng
    const usersJson = await fs.readFile('./data/users.json', 'utf-8');
    
    // Konvertera den lästa JSON-strängen till ett JavaScript-objekt (användarlista)
    const users = JSON.parse(usersJson);

    // Kontrollera om användaren med den angivna e-postadressen finns i användarlistan
    const user = users.find(user => user.email === email);

    if (user) {
      // Om användaren hittas, jämför det inkommande lösenordet med det hashade lösenordet
      const passMatch = bcrypt.compareSync(password, user.passwordHash);
      return passMatch;
    }
  } catch (error) {
    // Hantera fel som kan uppstå under inläsningen eller tolkningen av JSON-filen
    console.error('Error reading or parsing users.json', error);
    return false;
  }

  // Om användaren inte hittades eller om det uppstod något fel, returnera false som standardvärde
  return false;
};

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

  // om användaren är giltig skapas en payload med användarinformation och expiration time
    if (isValidUser(email, password)) {
      const userRole = getUserRole(email);
      let expirationTime;

    // sätter en expiration time baserat på användarens roll
      if (userRole === 'admin') {
      // Admins har en 1-timmes expiration time.
      expirationTime = 60 * 60; // 1 hour in seconds
    } else {
      // vanliga användare har en 30-sekunders expiration time.
      expirationTime = 30; // 30 secound.
      }

    // aktiverar jwt.sign() funktionen för att skapa en JWT med payload, secret key och expiration time
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

