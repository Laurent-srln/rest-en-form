require('dotenv').config();

const express = require('express');


const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const port = process.env.PORT || 5478;

const router = require('./app/router/router');

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "REST'Enforme API",
         version: "1.0.0",
         description: "A REST API for REST'Enforme"
      },
      servers: [
         // {
         //    url: "https://app-osport.herokuapp.com/api-v1"
         // }
         // ,
         {
            url: "http://localhost:3004/api-v1"
         }
      ]
   },
   apis: [ './app/router/*.js']
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-v1/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());

app.use(express.json());

app.use('/api-v1', router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}/api-v1/`);
});