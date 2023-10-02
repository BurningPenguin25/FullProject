
const MongoDBConnection = require('./MongoDB')
const express = require('express')
const app = express()
require('dotenv').config()
MongoDBConnection()

const bodyParser = require('body-parser')
const userroute = require('./UserRouter')


const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userroute)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Example app listening on port ${process.env.EXPRESS_PORT}`)
})
