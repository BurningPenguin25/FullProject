const Schema = require('./Schema')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 function SignUpFunctions(){

             async function FindUser(login: string){
             const userSchema = mongoose.model('collection1', Schema.UserSchema);
             return await userSchema.find({login})
             }

             async function HashPassword(password: string){
                 const saltRounds = 10;
                 const salt = bcrypt.genSaltSync(saltRounds)
                 return await bcrypt.hash(password, salt)
             }

             async function SaveUserFull(id: object, login: string, name: string, family: string, middlename: string, role: string, phone: string, email: string, hashpassword: string, accesstoken: string, refreshtoken: string){
                 const userSchema = mongoose.model('collection1', Schema.UserSchema);
                 const FullUser = new userSchema({_id: id, login, name, family, middlename, role, phone, email, password: hashpassword, accesstoken, refreshtoken});
                 FullUser.save()
             }

             async function SaveUserLight(id: object, login: string, hashpassword: string){
                 const userSchema = mongoose.model('collection2', Schema.UserSchema);
                 const lightUser = new userSchema({_id: id, login, password: hashpassword});
                 lightUser.save()
             }

              return {FindUser, HashPassword, SaveUserFull, SaveUserLight}
}


module.exports = SignUpFunctions;
