const express = require('express')
const GamesService = require('./games-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const gamesRouter = express.Router()
const jsonBodyParser = express.json()

gamesRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        GamesService.getAllGames(req.app.get('db'))
        // GamesService.getByUserId(req.app.get('db'), req.user.id)
            .then(games => {
                console.log(games)
                res.json(games)
            })
            .catch(next)
    })

    //refactor to get rid of userid, use req.user.id instead
    .post(jsonBodyParser, requireAuth, (req, res, next) => {
        const { name, notes, date_modified } = req.body
        const userid = req.user.id
        const newGame = { name, notes, date_modified, userid }

        if(!name) {
            return res
                .status(400)
                .json({ error: {message: 'Name required'}})
        }
        GamesService.insertGame(req.app.get('db'), newGame)
        .then(game => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${game.id}`))
                .json(game)
        })
    })

gamesRouter
    .route('/:game_id')
    .get(requireAuth, (req, res, next) => {
        GamesService.getById(req.app.get('db'))
            .then(game => {
                res.json(game)
            })
            .catch(next)
    })
    .delete(requireAuth, (req, res, next) => {
        GamesService.deleteGame(req.app.get('db'), req.params.game_id)
        .then(game => {
            if(!game) {
                return res.status(404).json({
                    error: {message: 'Game does not exist'}
                })
            }
            res
                .status(204)
                .end()
        
    })
    .catch(next)
    })

module.exports = gamesRouter