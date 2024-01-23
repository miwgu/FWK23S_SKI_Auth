const express = require('express');
const jwt = require('jsonwebtoken');
//const crypto = require('crypto');

const router = express.Router();
// I do not need to use this because I use SECRET_KEY in .env
//const secretKey_crypto = crypto.randomBytes(32).toString('base64');

//Use .env This file should not upload to github(.gitignore) This .env file is a secret file in our group5
const secretKey = process.env.SECRET_KEY;

console.log(`SecretKey: ${secretKey}`);

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const payload = { 
     email: req.body.email,
     role: getUserRole(email), 
     exp: Math.floor(Date.now()/1000) + (60*60)// 1h (3600 sec): converts the timestamp from milliseconds to seconds and 60 second * X minuts
      };

  const token = jwt.sign(
      payload,
      secretKey
      //{ expiresIn: '1h' }
    );
  console.log(`Generated JWT: ${token}`);
  
  if (isValidUser(email, password)) {
    token
    res.json({ token });
    console.log('Login Successful :)');
  } else {
    res.status(401).json({ error: 'Invalid login' });
    console.log('Invalid email or password');
  }
  
  
});


/*
//This is original code
const isValidUser = (email, password) => {
  return email === 'user@example.com' && password === 'password';
};
*/

// I need two type of users,Admin and User to log in this app
const users =[
  {email:"user@example.com", password:"password"},
  {email:"miwa@example.com", password:"password"},
  {email:"admin@example.com", password:"password"},
]

 /**
  * Function isValidUser: to login
  * @param {*} email, password 
  * @returns true or false
  */
const isValidUser =(email,password )=>{
 for (const user of users) {
      if(user.email ===email&& user.password===password ){
        return true;
     }
  }
        return false;
};

 /**
  * Function getUserRole: to determin login-users role
  * @param {*} email 
  * @returns 'admin' or 'user'
  */
const getUserRole = (email) => {
  return email === 'admin@example.com' ? 'admin' : 'user';
};

module.exports = router;