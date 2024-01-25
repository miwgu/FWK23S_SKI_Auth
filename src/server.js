//installerar express för att kunna använda express.Router()
const express = require('express');
//body parser är en middleware som används för att kunna tolka JSON
const bodyParser = require('body-parser');
//importerar routes från auth_routes.js
const authRoutes = require('./routes/auth_routes');
//cors används för att kunna göra cross-origin requests på ett säkert sätt
const cors = require('cors'); 
//helmet används för att sätta säkerhetsheaders och skydda appen från vissa webbattacker
const helmet = require('helmet');

const app = express();
//använder helmet i appen för att sätta säkerhetsheaders och skydda appen från vissa webbattacker
app.use(helmet());

//använder cors i appen för att kunna göra cross-origin requests på ett säkert sätt
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);

module.exports = app;
