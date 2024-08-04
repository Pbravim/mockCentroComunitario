const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Centros Comunitários',
      version: '1.0.0',
      description: 'Documentação da API de Gestão de Centros Comunitários',
    },
    servers: [
      {
        url: process.env.URL_API,
      },
    ],
  },
  apis: ['./src/routers/*.js'], // Caminho para os arquivos de rota
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
