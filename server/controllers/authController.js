const bcrypt = require('bcrypt');
const User = require("../models/model");
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')


const generateToken = (id, nick, rating) => {
    const payload = {
        id,
        nick,
        rating
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}


class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            } 
            const {nickname, password} = req.body;
            const candidate = await User.findOne({where: {nickname}})
            if(candidate){
                return res.status(400).json({message: "Пользователь с таким именем уже существует!"})
            } 
            const hashPassword = bcrypt.hashSync(password, 8);
            const user = new User({nickname, password: hashPassword})
            await user.save()
            return res.json({message: "Пользователь успешно зарегестрирован !"})
        } catch (error) {
            console.log(`Error catch ${error}`);
            return res.status(400).json({message: 'Registration error!'})
        }
    }

    async login(req, res) {
        try {
            const {nickname, password} = req.body
            const user = await User.findOne({where: {nickname}})
            if(!user) return res.status(400).json({message: "Пользователь с таким именем не найден!"})
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword) return res.status(400).json({message: "Введен неверный пароль!"})
            const token = generateToken(user.id, user.nickname, user.rating)
            return res.json({token})

        } catch (error) {
            console.log(`Error catch ${error}`)
            return res.status(400).json({message: 'Login error!'})
        }
    }

}

module.exports = new authController()