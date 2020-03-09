const express = require('express')
const PlayersService = require('./players-service')

const playersRouter = express.Router()

playersRouter
    .route('/:game_id')
    .get((req, res, next), () => {
        PlayersService.getPlayersByGameId(req.app.get('db'))
            .then(players => {
                res.json(players)
            })
            .catch(next)
    })
