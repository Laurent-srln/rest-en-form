require('dotenv').config();
const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');


const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger-doc.yaml');

const port = process.env.PORT || 5478;

const router = require('./app/router/router');


const app = express();

app.use("/api-v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());

app.use(express.json());

app.use('/api-v1', router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}/api-v1/`);
});