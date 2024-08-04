const fs = require('fs')
const { connectDB, client } = require('../config/mongo')
const {ObjectId} = require('mongodb')
async function migrate() {
  try {
    const db = await connectDB()
    const centersCollection = db.collection('centros_comunitarios')
    const recursosCollection = db.collection('recursos')
    
    await centersCollection.deleteMany({})
    await recursosCollection.deleteMany({})

    const recursosData = JSON.parse(fs.readFileSync('migrate/dataMigrateRecursos.json', 'utf8'))
    await recursosCollection.insertMany(recursosData)
    

    
    const centroData = JSON.parse(fs.readFileSync('migrate/dataMigrateCentro.json', 'utf8'))
    for (const center of centroData) {
      const recursoDocs = await recursosCollection.find({ nome: { $in: Object.keys(center.recursos) } }).toArray()

      const recursosMapeados = recursoDocs.map(recurso => {
          return {
              _id: new ObjectId(recurso._id),
              quantidade: center.recursos[recurso.nome]
          }
      })
      center.recursos = recursosMapeados
  }

  await centersCollection.insertMany(centroData) 

  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

migrate()
