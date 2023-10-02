const express = require('express');
const router = express.Router()

const UserControl = require('./UserControl')
const usercontrol = new UserControl();
const Middleware = require('./Middleware')
const middleware = new Middleware();



router.post('/signup', usercontrol.SignUp)
router.post('/login',middleware.AuthMiddleware, usercontrol.LogIn)
router.get('/findAll', usercontrol.FindAll)
router.get('/:id', usercontrol.FindOne)
router.put('/:id', usercontrol.Update)
router.delete('/:id', usercontrol.Delete)


router.post('/refresh', usercontrol.RefreshToken)

router.get('/logOut', usercontrol.LogOut)



// router.get('/refresh_token', )




module.exports = router