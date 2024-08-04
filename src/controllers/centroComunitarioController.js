const centroComunitarioService = require('../services/centroComunitarioService')
const {sendNotification} = require('../utils/axios')

const registerCentro = async (req, res) => {
    try {
        const { nome, rua, numero, bairro, cidade, lotacao_atual, lotacao_maxima, recursos } = req.body

        const endereco = { rua, numero, bairro, cidade }
        const centroData = { nome, endereco, lotacao_atual, lotacao_maxima, recursos }
        
        const result = await centroComunitarioService.registerCentro(centroData)
        res.status(201).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json(e)
    }
}

const updateLotacao = async (req, res) => {
    try {
        const centroComunitarioId = req.params.id
        const { novaLotacao } = req.body

        const result = await centroComunitarioService.updateLotacaoAtual(centroComunitarioId, novaLotacao)

        if (result.flagLotacaoMax){
            // sendNotification(result)
            console.log('Lotação maxima atingida')
        }

        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json(e)
    }
}

const exchangeRecursos = async(req, res) => {
    try {
        const {centroId1, centroId2, recursos1, recursos2} = req.body
        const result = await centroComunitarioService.exchangeRecursos(centroId1,centroId2,recursos1,recursos2)
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json(e)
    }
}


module.exports = {
    registerCentro,
    updateLotacao,
    exchangeRecursos
}