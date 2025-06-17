const {Router} = require("express")
const routes = Router()

// Rota de teste para verificar se o servidor está funcionando
routes.get('/', (req, res) => {
    return res.status(200).send({ message: 'API funcionando!' })
})


// Rotas de clientes
routes.use('/clients', require('./client.routes'))

// Rotas de times
routes.use('/teams', require('./team.routes'))

module.exports = routes