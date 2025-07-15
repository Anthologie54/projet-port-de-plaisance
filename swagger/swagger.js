const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Port de Plaisance Russell',
      version: '1.0.0',
      description: 'Documentation de l\'API pour gérer les catways, réservations et utilisateurs'
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
    },
    apis: [
        './routes/*.js',
        './swagger/components.yaml'
    ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};