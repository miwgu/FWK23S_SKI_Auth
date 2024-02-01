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

const { USER1_EMAIL, USER1_PASSWORD_HASH, USER2_EMAIL, USER2_PASSWORD_HASH, ADMIN_EMAIL, ADMIN_PASSWORD_HASH } = process.env;

//Läser in Json fil
// pausa exekveringen av den funktionen själv tills promise(await) är löst och hämta resultatet av promise(await).
//I JavaScript omsluts ett reguljärt uttryck av snedstreck (/). Flaggan g i slutet av det reguljära uttrycket står för "global". Det matchar alla förekomster av mönstret i inmatningssträngen, snarare än bara den första.
async function readUsersJson() {
  try {
    const usersJson = await fs.readFile('./data/users.json', 'utf-8');
    const replacedJson = usersJson
      .replace(/\${USER1_EMAIL}/g, USER1_EMAIL)
      .replace(/\${USER1_PASSWORD_HASH}/g, USER1_PASSWORD_HASH)
      .replace(/\${USER2_EMAIL}/g, USER2_EMAIL)
      .replace(/\${USER2_PASSWORD_HASH}/g, USER2_PASSWORD_HASH)
      .replace(/\${ADMIN_EMAIL}/g, ADMIN_EMAIL)
      .replace(/\${ADMIN_PASSWORD_HASH}/g, ADMIN_PASSWORD_HASH);

    const usersData = JSON.parse(replacedJson);
    return usersData.users;
  } catch (error) {
    console.error('Error reading or parsing users.json:', error);
    return [];
  }
}

// Skriva users log in Bash 
readUsersJson()
  .then(users => console.log("USERS",users))
  .catch(error => console.error('Error reading users.json:', error));

/**
 * parameter email används för att jämföra med användarens e-post och parameter password används för att jämföra med användarens lösenord.
 * @param {string} email Användarens e-post.
 * @param {string} password Användarens lösenord.
 * @returns {boolean} Sant om användaren är giltig, annars falskt.
 */

//kollar om användaren är giltig genom att jämföra e-post och lösenord
async function isValidUser(email, password) {
  try {
    // Read users data from users.json
    const users = await readUsersJson();

    // Find the user with the provided email
    const user = users.find(user => user.email === email);
    if (user) {
      // Compare the provided password with the passwordHash of the user
      const passMatch = bcrypt.compareSync(password, user.passwordHash);
      if (passMatch) {
        // Passwords match, return true
        return true;
      } else {
        // Passwords do not match, return false
        console.log('Password does not match');
        return false;
      }
    } else {
      // If user with the provided email is not found, return false
      console.log('User not found');
      return false;
    }
  } catch (error) {
    console.error('Error validating user:', error);
    return false;
  }
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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

   // om användaren är giltig skapas en payload med användarinformation och expiration time
    if (await isValidUser(email, password)) {
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