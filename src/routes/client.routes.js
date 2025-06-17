const { Router } = require('express');
const routes = Router();

const clientController = require('../controllers/client.controller');

// Rota para criar um novo cliente
routes.post('/', clientController.create);

// Rota para listar todos os clientes
routes.get('/', clientController.findAll);

module.exports = routes;
