const { connectDB } = require('../config/mongo')
const {ObjectId} = require('mongodb')

const filterByOcupacao = async () => {
    try{

        const db = await connectDB()
        const centroCollection = db.collection('centros_comunitarios')
           
        const centros = await centroCollection.find({ 
            $expr: {
                $gte: [{ $multiply: [{ $divide: ["$lotacao_atual", "$lotacao_maxima"]}, 100]}, 90]
            }
        }).toArray()

        return centros
    }catch(e){
        throw new Error(e)
    }
}

const getMediaRecursos = async () => {
    const db = await connectDB()
    const centroCollection = db.collection('centros_comunitarios')

    const mediaRecursos = await centroCollection.aggregate([
        { 
            $unwind: "$recursos"
        },
        {
            $lookup: {
                from: "recursos", 
                localField: "recursos._id", 
                foreignField: "_id", 
                as: "recursoDetalhes" 
            }
        },
        {
            $unwind: "$recursoDetalhes"

        },
        {
            $group: {
                _id: "$recursoDetalhes.nome",
                media: { $avg: "$recursos.quantidade" }
            } 
        },
        { 
            $project: {
                Nome: '$_id',
                Media: '$media'
            }
        }
    ]).toArray();

    return mediaRecursos
}

const getHistoricoNegociacoes = async (centroId, dataInicio) => {
    try {
        const db = await connectDB();
        const negociacoesCollection = db.collection('historico_trocas');
        const centersCollection = db.collection('centros_comunitarios')
        
        const centro = await centersCollection.findOne({ _id: new ObjectId(centroId) })

        if (!centro){
            throw new Error("Confira o id do centro")
        }

        let query = {
            $or: [
                { centro_id1: (centroId) }, 
                { centro_id2: (centroId) }
            ]
        };

        if (dataInicio) {
            query = {
                $and: [
                    query,
                    { data: { $gte: new Date(dataInicio) } }
                ]
            }
        }
        
        const historico = await negociacoesCollection.find(query).toArray()

        return historico
    } catch (e) {
        throw new Error(e)
    }
}


module.exports = {
    filterByOcupacao,
    getMediaRecursos,
    getHistoricoNegociacoes
}