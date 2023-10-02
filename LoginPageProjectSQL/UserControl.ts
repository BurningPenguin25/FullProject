const {express, Request, Response} = require('express');
const mongoose = require('mongoose')
const Schema = require('./Schema')
const SignUpFunction = require('./SignUpFunction')
const signupfunction = new SignUpFunction()
const LogInFunction = require('./LogInFunction')
const loginfunction = new LogInFunction()
const TokenFunction = require('./TokenFunctions')
const tokenfunction = new TokenFunction()
const jwt = require('jsonwebtoken');

const ObjectId = require('mongodb').ObjectId;
const id = new ObjectId()

function UserControl(){

   async function SignUp(req: typeof Request, res: typeof Response){
       const {login, name, family, middleName, role, phone, email, password} = req.body
       try{

               const findUser = await signupfunction.FindUser(login)

               if(findUser) {
                   const hashpassword = await signupfunction.HashPassword(password)
                   const accesstoken = await tokenfunction.CreateAccessToken(id, hashpassword)
                   const refreshtoken = await tokenfunction.CreateRefreshToken(id, hashpassword)
                   await signupfunction.SaveUserFull(id, login, name, family, middleName, role, phone, email, hashpassword, accesstoken, refreshtoken)
                   await signupfunction.SaveUserLight(id, login, hashpassword) // доп таблица. Можно и удалить

                   res
                       .cookie('accessToken', accesstoken, {httpOnly: true, Secure: true, Expires: 24 * 60 * 60 * 1000})
                       .cookie('refreshToken', refreshtoken, {httpOnly: true, Secure: true, Expires: 7 * 24 * 60 * 60 * 1000}) // где хранить?
                       .send('ok')
                       .status(200)
               }

       } catch (e) {
           res
               .status(403)
       }
    }




    async function LogIn(req: typeof Request, res: typeof Response){

        const {login, password} = req.body
        //const id = req.params

        const userToken = req.cookies.accessToken // пока что id получаю так. Дальше будет приходить с запросом клиента req.params
        const jwtObj = jwt.decode(userToken, process.env.PRIVATE_KEY_ACCESS_TOKEN)
        const id = jwtObj.id

        const findUser = await signupfunction.FindUser(login)
        const comparePassword = await loginfunction.comparePassword(login, password)

       try{
           if(findUser && comparePassword ) {

               const hashpassword = await signupfunction.HashPassword(password)
               const accesstoken = await tokenfunction.CreateAccessToken(id, hashpassword)
               // const refreshtoken = await tokenfunction.CreateRefreshToken(id, hashpassword)

               const userSchema = mongoose.model('collection1', Schema.UserSchema);
               await userSchema.findByIdAndUpdate(id, {'accesstoken': accesstoken}); // добавить сроку замены changedAt
               // await userSchema.findByIdAndUpdate(id, {'refreshtoken': refreshtoken}) надо ли заменять refreshtoken ?

               res
                   .cookie('accessToken', accesstoken, {httpOnly: true, Secure: true, Expires: 24 * 60 * 60 * 1000})
                   //.cookie('refreshToken', refreshtoken, {httpOnly: true, Secure: true, Expires: 7 * 24 * 60 * 60 * 1000}) надо ли заменять refreshtoken ?
                   .send('dddd')
                   .status(200)
           }

       } catch (e) {
               res
                   .send('err')
                   .status(403)
       }


    }




    async function FindAll(req: typeof Request, res: typeof Response){
        try{
            const userSchema = mongoose.model('collection1', Schema.UserSchema);
            const findAll = await userSchema.find({})
            res.status(200).json(findAll)
        }catch (e) {
            res.status(404)
        }
    }

    async function FindOne(req: typeof Request, res: typeof Response){
         const id = req.params.id;
        try{
            const userSchema = mongoose.model('collection1', Schema.UserSchema);
            const findOne = await userSchema.findById(id)
            res.status(200).json(findOne)
        }catch (e) {
            res.status(404)
        }
    }

    async function Update(req: typeof Request, res: typeof Response){
        const id = req.params.id;

        try{
            const userSchema = mongoose.model('collection1', Schema.UserSchema);
            const Update = await userSchema.findByIdAndUpdate(
                id,
                {
                login: req?.body?.login,
                name: req?.body?.name,
                family: req?.body?.family,
                phone: req?.body?.phone,
                email: req?.body?.email,
            },
                {new: true}
            );
            res.status(200).json(Update)
        }catch (e) {
            res.status(400)
        }
    }

    async function Delete(req: typeof Request, res: typeof Response){
        const id = req.params.id;
        try{
            const userSchema = mongoose.model('collection1', Schema.UserSchema);
            const Delete = await userSchema.findByIdAndDelete(id)
            res.status(200).json(Delete)
        }catch (e) {
            res.status(400)
        }
    }


    // async function UpdatePassword(req: typeof Request, res: typeof Response){
    //     const {login, password} = req.body
    //     try{
    //
    //     }catch (e) {
    //
    //     }
    // }


    async function RefreshToken(req: typeof Request, res: typeof Response){
        const refreshToken = req.cookies.refreshToken
        const {password} = req.body
        //const id = req.params.id;

        try{
            const verifyAccess = jwt.verify(refreshToken, process.env.PRIVATE_KEY_REFRESH_TOKEN)
            const IDRefreshToken = verifyAccess.id

            const userSchema = mongoose.model('collection1', Schema.UserSchema);
            const findUserById = await userSchema.findById(IDRefreshToken)

            const IDUserDB = findUserById.id

            if(verifyAccess.id == findUserById.id && verifyAccess.password == findUserById.password && refreshToken == findUserById.refreshtoken ){ //&& refreshBD == refreshToken или просто сравнить токены?

                  const accesstoken = tokenfunction.CreateAccessToken(IDUserDB, password);  // а откуда брать пароль?
                  const refreshtoken = tokenfunction.CreateRefreshToken(IDUserDB, password) // а откуда брать пароль?

                userSchema.findByIdAndUpdate({id}, {'accesstoken': accesstoken}, {'refreshtoken': refreshtoken} ) // замена токена в БД

                res // замена токена в куках
                    .cookie('accessToken', accesstoken, {httpOnly: true, Secure: true, Expires: 24 * 60 * 60 * 1000})
                    .cookie('refreshToken', refreshtoken, {httpOnly: true, Secure: true, Expires: 7 * 24 * 60 * 60 * 1000})
            }

        } catch (e) {
            res.status(403)
        }
    }


    async function LogOut(req: typeof Request, res: typeof Response){

    }


    return {SignUp, LogIn, Update, Delete, FindAll, FindOne, RefreshToken, LogOut}
}

module.exports = UserControl;