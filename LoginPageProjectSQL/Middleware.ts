const {Request, Response, Next} = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const Schema = require("./Schema");



function MiddlewareFunctions(){

    async function AuthMiddleware(req: typeof Request, res: typeof Response, next: typeof Next){

        const userToken = req.cookies.accessToken // получение куки
        const verify = jwt.verify(userToken, process.env.PRIVATE_KEY_ACCESS_TOKEN)

        const userSchema = mongoose.model('collection1', Schema.UserSchema);
        const resuBD = await userSchema.findOne({_id: verify.id}) // возвращает массив




        //if(resuBD._id == verify.id && verify.password ===  resuBD.password ){ // сравнить расшифрованные пароли bcrypt
        if(resuBD._id == verify.id){
            next()
        } else {
        console.log('неверный ')
        }
    }

    return { AuthMiddleware}
}

module.exports = MiddlewareFunctions;
