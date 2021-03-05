require('dotenv').config();

const express = require('express');

const app = express();

const cors = require('cors');

const port = process.env.PORT || 5478;

const router = require('./app/router');

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}`);
});