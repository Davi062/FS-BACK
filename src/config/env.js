const path = require('path')
const dotenv = require('dotenv')

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({
    path: path.resolve(process.cwd(), '.env')
})

module.exports = {
    PORT: process.env.PORT || 3333,
    NODE_ENV: process.env.NODE_ENV || 'development'
}
