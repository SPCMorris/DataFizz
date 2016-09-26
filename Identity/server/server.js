const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const contentLength = require('express-content-length-validator');

const app = express();
const http = require('http');
const server = http.createServer(app);

// For database access and creation.
const dotenv = require('dotenv').config();
const db = require('./db/db.js');

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(express.static('./client'));

// Reduces vulnerabilities to large payload attacks
app.use(contentLength.validateMax());

// Middleware for setting headers.
app.use(cors());

// Middleware that sets HTTP headers for various concerns.
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

app.get('*', (req,res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), () => {
  db.ensureSchema();
  console.log(moment().format('h:mm:ss a') + ': Server is Listening on port', app.get('port'));
});