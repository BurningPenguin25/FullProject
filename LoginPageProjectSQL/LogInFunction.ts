const Schema = require('./Schema')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');


function LogInFunction(){

    async function comparePassword(login: string, password: string){
        const userSchema = mongoose.model('collection1', Schema.UserSchema);
        const findPassword = await userSchema.findOne({login})
        const hash = findPassword.get('password')
        return await bcrypt.compare(password, hash)
    }

    async function findToken(login: string){
        const userSchema = mongoose.model('collection3', Schema.UserSchema);
        const findPassword = await userSchema.findOne({login})
        return findPassword.get('token')
    }






    return {comparePassword, findToken}
}


module.exports = LogInFunction;