const express = require('express')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users)
            })
            .catch(next)
    })

    .post(jsonBodyParser, (req, res, next) => {
        const { name, password, admin } = req.body
        const newUser = { name, password, admin }

        if(!newUser) {
            return res
                .status(400)
                .json({ error: {message: 'User required'}})
        }

        if(!name || !password) {
            return res 
                .status(400)
                .json({ error: {message: 'Name and password required'}})
        }
        UsersService.insertUser(req.app.get('db'), newUser)
            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(user)
            })
    })

module.exports = usersRouter;