const {Router} = require('express');
const controller = require('../controllers/authController')
const router = new Router()
const {check} = require('express-validator')


router.post('/registration',[
    check('nickname', 'Имя пользователя не может быть пустым!').notEmpty(),
    check('password', 'Пароль должен быть не менее 6 символов').isLength({min: 7})
], controller.registration);
router.post('/login', controller.login);

module.exports = router