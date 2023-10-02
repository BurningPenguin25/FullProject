const jwt = require('jsonwebtoken');

function TokenFunction(){

    async function CreateAccessToken(id:object, password: string){
        const privateAccessKey = process.env.PRIVATE_KEY_ACCESS_TOKEN
        return  await jwt.sign({id,  password}, privateAccessKey, {expiresIn: 24*60*60});
    }

    async function CreateRefreshToken(id:object, password: string){
        const privateRefreshKey = process.env.PRIVATE_KEY_REFRESH_TOKEN
        return await jwt.sign({id,  password}, privateRefreshKey, {expiresIn: 7*24*60*60});
    }

    return {CreateAccessToken, CreateRefreshToken}
}

module.exports = TokenFunction;