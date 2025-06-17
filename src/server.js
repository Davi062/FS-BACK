const express = require("express")
const http = require('http')
const routes = require("./routes")

const app = express()
const PORT = process.env.PORT || 3333
let server

// Função para tentar iniciar o servidor em uma porta
function startServer(port) {
  return new Promise((resolve, reject) => {
    const srv = app.listen(port, () => {
      console.log(`Server running on port ${port}`)
      resolve(srv)
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying port ${port + 1}...`)
        resolve(startServer(port + 1))
      } else {
        reject(err)
      }
    })
  })
}

// Configuração manual para permitir CORS
app.use((req, res, next) => {
    // Em desenvolvimento, aceita de qualquer origem
    const allowedOrigins = [
        'http://localhost:8080',
        'http://frontend:8080',
        'http://127.0.0.1:8080',
        process.env.FRONTEND_URL // Para o Railway
    ].filter(Boolean); // Remove valores undefined/null
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    
    // Responde imediatamente às solicitações OPTIONS (pre-flight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next()
})

// Configuração para ignorar o corpo em solicitações GET
app.use((req, res, next) => {
    if (req.method === 'GET') {
        // Para GET requests, não tentamos analisar o corpo JSON
        next()
    } else {
        // Para outros métodos, continuamos com o fluxo normal
        express.json()(req, res, next)
    }
})

// Middleware para tratar erros de parsing JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Erro de parsing JSON:', err.message)
        return res.status(400).json({ error: "Erro no formato JSON enviado" })
    }
    next(err)
})

app.use(routes)

// Middleware de tratamento de erros gerais
app.use((error, req, res, next) => {
    console.error(error)
    return res.status(500).json({ error: "Erro interno do servidor" })
})

// Iniciar o servidor
startServer(PORT)
  .then(srv => {
    server = srv
    console.log(`Servidor rodando em [::]:${server.address().port}`)
  })
  .catch(err => {
    console.error('Falha ao iniciar o servidor:', err)
    process.exit(1)
  })

// Lidar com encerramento gracioso
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando graciosamente...')
  server?.close(() => {
    console.log('Servidor encerrado')
    process.exit(0)
  })
})