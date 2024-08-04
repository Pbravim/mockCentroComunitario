const App = require('./app')
const app = new App()
const { connectDB } = require('./config/mongo')


connectDB()
.then((db) => {
    console.log(`DB: ${db.databaseName}`)
})
.catch((e) => console.error(e))

app.start(3010)