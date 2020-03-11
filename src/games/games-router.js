const express = require('express')
const GamesService = require('./games-service')

const gamesRouter = express.Router()

gamesRouter
    .route('/')
    .get((req, res, next) => {
        GamesService.getAllGames(req.app.get('db'))
            .then(games => {
                res.json(games)
            })
            .catch(next)
    })

gamesRouter
    .route('/:game_id')
    .get((req, res, next) => {
        GamesService.getById(req.app.get('db'))
            .then(game => {
                res.json(game)
            })
            .catch(next)
    })

gamesRouter
    .route('/:user_id')
    .get((req, res, next) => {
        GamesService.getByUserId(req.app.get('db'))
            .then(games => {
                res.json(games)
            })
            .catch(next)
    })

module.exports = gamesRouter;