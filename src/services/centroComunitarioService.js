const { connectDB } = require('../config/mongo')
const {ObjectId} = require('mongodb')


const registerCentro = async (centroData) => {
    try {
        const db = await connectDB()
        const centersCollection = db.collection('centros_comunitarios')
        const recursosMapeados = Object.keys(centroData.recursos).map(id => {
            
            return {
                _id: new ObjectId(id),
                quantidade: centroData.recursos[id]
            }
        })

        const updatedCentroData = {
            ...centroData,
            recursos: recursosMapeados
        }

        const result = await centersCollection.insertOne(updatedCentroData)
        return result
    } catch (e) {
        console.error(e)
        throw new Error (e)
    }
}

const updateLotacaoAtual = async (centroId, novaLotacao) => {
    try {
        const db = await connectDB()
        const centersCollection = db.collection('centros_comunitarios')

        const centro = await centersCollection.findOne({ _id: new ObjectId(centroId) })
        if (!centro) {
            throw new Error('Centro comunitário não encontrado')
        }

        const lotacaoMaxima = centro.lotacao_maxima
        
        const result = await centersCollection.updateOne(
            { _id: new ObjectId(centroId) },
            { $set: { 'lotacao_atual': novaLotacao } } 
        )
        
        if (novaLotacao >= lotacaoMaxima) {
            return {result, flagLotacaoMax : {centroId, centroNome : centro.nome, lotacaoMaxima, novaLotacao}}
        }
        return result
    } catch (e) {
        console.error(e)
        throw new Error (e)
    }
}

const exchangeRecursos = async (centroId1, centroId2, recursos1, recursos2) => {
    try{
        const db = await connectDB()
        const centersCollection = db.collection('centros_comunitarios')
        const recursoCollection = db.collection('recursos')
        const historicoCollection = db.collection('historico_trocas')

        const centro1 = await centersCollection.findOne({ _id: new ObjectId(centroId1) })
        const centro2 = await centersCollection.findOne({ _id: new ObjectId(centroId2) })
        if (!centro1 || !centro2){
            throw new Error("Confira o id dos centros")
            
        }

        const recursos1Docs = await recursoCollection.find({ _id: { $in: Object.keys(recursos1).map(id => new ObjectId(id)) } }).toArray()
        const pontosRecursos1 = recursos1Docs.reduce((total, recurso) => { 
            const quantidade = recursos1[recurso._id.toString()]
            return total + recurso.pontos * quantidade }, 0)

        const recursos2Docs = await recursoCollection.find({ _id: { $in: Object.keys(recursos2).map(id => new ObjectId(id)) } }).toArray()
        const pontosRecursos2 = recursos2Docs.reduce((total, recurso) => {
            const quantidade = recursos2[recurso._id.toString()]
            return total + recurso.pontos * quantidade}, 0)
      
        if (pontosRecursos1 !== pontosRecursos2) {
            if (!((centro1.lotacao_atual / centro1.lotacao_maxima > 0.9) && pontosRecursos1 < pontosRecursos2) && !((centro2.lotacao_atual / centro2.lotacao_maxima > 0.9) && pontosRecursos2 < pontosRecursos1)) {
                throw new Error("Troca inválida");
            }
        }


        const newRecursosCentro1 = updateRecursosCentro(centro1.recursos, recursos2, recursos1)
        const newRecursosCentro2 = updateRecursosCentro(centro2.recursos, recursos1, recursos2)

        await centersCollection.updateOne({ _id: new ObjectId(centroId1) }, { $set: { recursos: newRecursosCentro1 } })
        await centersCollection.updateOne({ _id: new ObjectId(centroId2) }, { $set: { recursos: newRecursosCentro2 } })

        const troca = {
            centro_id1: centroId1,
            centro_id2: centroId2,
            recursos1,
            recursos2,
            data: new Date()
        }
        await historicoCollection.insertOne(troca)
        return troca
    } catch (e) {
        console.error(e)
    }
}

const updateRecursosCentro = (recursosCentro, recursosParaAdicionar, recursosParaRemover) => {
    const recursosCentroMap = {}
    recursosCentro.map(recurso => {
        recursosCentroMap[recurso._id.toString()] = recurso.quantidade
    });

    for (const [id, quantidade] of Object.entries(recursosParaRemover)) {
        if (!recursosCentroMap[id] || recursosCentroMap[id] < quantidade) {
            throw new Error('Quantidade insuficiente: ')
        }
        recursosCentroMap[id] -= quantidade
        if (recursosCentroMap[id] <= 0) {
            delete recursosCentroMap[id]
        }
    }

    for (const [id, quantidade] of Object.entries(recursosParaAdicionar)) {
        if (recursosCentroMap[id]) {
            recursosCentroMap[id] += quantidade
        } else {
            recursosCentroMap[id] = quantidade
        }
    }

    const updatedRecursos = Object.entries(recursosCentroMap).map(([id, quantidade]) => ({
        _id: new ObjectId(id),
        quantidade: quantidade
    }))

    return updatedRecursos
}

module.exports = {
    registerCentro,
    updateLotacaoAtual,
    exchangeRecursos
}
