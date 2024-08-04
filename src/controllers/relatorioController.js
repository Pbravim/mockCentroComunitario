const relatorioService = require('../services/relatorioService')

const filterByOcupacao = async (req, res) => {
    try {
        const result = await relatorioService.filterByOcupacao()
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json(e)
    }
}

const getMediaRecursos = async (req, res) => {
    try{
        const result = await relatorioService.getMediaRecursos()    
        res.status(200).json(result)
    } catch(e){
        console.error(e)
        res.status(500).json(e)
    }

}

const getHistoricoNegociacoes = async (req, res) => {
    try {
        const {id} = req.params
        const {dataInicio} = req.query

        const result = await relatorioService.getHistoricoNegociacoes(id, dataInicio)  
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(500).json(e)
    }
}
module.exports = {
    filterByOcupacao,
    getMediaRecursos,
    getHistoricoNegociacoes
}