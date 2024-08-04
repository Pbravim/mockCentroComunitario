const {MongoClient} = require('mongodb')
require('dotenv').config()

const url = process.env.DATABASE_URL

const client = new MongoClient(url) 

async function connectDB() {
    try {
         await client.connect()
        
         const db = client.db('teste_desastre_natural')
  
        return db
    } catch (e) {
        console.error(e)
    }
}

  
module.exports = { client, connectDB }
