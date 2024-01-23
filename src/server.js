const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth_routes');
const cors = require('cors'); 
const csp = require('helmet-csp');

const app = express();

app.use(cors());  // Use CORS middleware without any restrictions
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use(csp({}));

module.exports = app;
