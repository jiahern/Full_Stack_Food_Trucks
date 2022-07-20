require('dotenv').config()
const mongoose = require('mongoose')
CONNECTION_STRING = 
"mongodb+srv://<username>:<password>@project-t18-hellozeus.shgk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// "mongodb+srv://<username>:<password>@cluster0.5q0ge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

MONGO_URL = 
CONNECTION_STRING.replace ("<username>",process.env.MONGO_USERNAME)
.replace("<password>",process.env.MONGO_PASSWORD);
mongoose.connect(MONGO_URL || "mongodb://localhost", 
    {useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex :true,
        useCreateIndex:true,
        useFindAndModify : false,
        dbName : 'project-t18-hellozeus'})

const db = mongoose.connection

db.on('error', err =>{
    console.error(err)
    process.exit(1)
})
db.once('open',async ()=>{
    console.log("Mongo connection started on " + db.host + ":" + db.port)
})

require("./user")
require("./order")
require("./food")
require("./van")
