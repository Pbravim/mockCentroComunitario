const express = require('express')
const cors = require('cors')
require('dotenv').config()

//Routes
const setupSwagger = require('./config/swagger');
const centroComunitarioRouter = require('./routers/centroComunitariosRouter')
const relatorioRouter = require('./routers/relatorioRouter')

class App {
    constructor(){
        this.app = express()
        this.middlewares()
        this.routes()
        setupSwagger(this.app)
    }
    
    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
    }
    
    routes(){
        this.app.use('/centroComunitario', centroComunitarioRouter)
        this.app.use('/relatorios', relatorioRouter)
    }
    
    start(port){
        this.app.listen(port, ()=>{
            console.log('Rodando na porta: ', port)
            console.log('Documentação: ', process.env.URL_API + '/api-docs')
        })
    }
}

module.exports = App
