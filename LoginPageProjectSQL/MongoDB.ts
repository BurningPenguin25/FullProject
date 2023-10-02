const mongoose = require('mongoose')
const mongoDB = `mongodb://localhost:27017/Project`

let MongoDBConnection = async () => {
    await mongoose.connect(mongoDB,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 3000,
    }).then(()=>{
        console.log('MongoDB has started')
    }).catch((err: string)=>{
        console.log('MongoDB error'+err)
    })
}

module.exports = MongoDBConnection;