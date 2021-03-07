require('dotenv').config();

const express = require('express');

const app = express();

const cors = require('cors');

const port = process.env.PORT || 5478;

const router = require('./app/router');

console.log(process.env.DATABASE_URL);

app.use(cors());

app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}`);
});