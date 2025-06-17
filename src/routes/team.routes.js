const { Router } = require('express');
const routes = Router();

const teamController = require('../controllers/team.controller');

// Rota para criar um novo membro da equipe
routes.post('/', teamController.create);

// Rota para listar todos os membros da equipe
routes.get('/', teamController.findAll);

// Rota para buscar um membro específico por ID
routes.get('/:id', teamController.findOne);

// Rota para atualizar um membro da equipe
routes.put('/:id', teamController.update);

// Rota para remover um membro da equipe
routes.delete('/:id', teamController.delete);

module.exports = routes;
