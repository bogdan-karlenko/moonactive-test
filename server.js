require('dotenv').config();
const app = require('./app');
const http = require('http');

const run = require('./helpers').run;

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`----- Server is listening on port ${port} -----`);
    setInterval(run, 1000);
});
