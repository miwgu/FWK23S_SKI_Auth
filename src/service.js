require('dotenv').config();
const app = require('./server.js');
const PORT = process.env.AUTH_PORT

app.listen(PORT, () => {
    console.log(`http server listening on port ${PORT}`)
});
