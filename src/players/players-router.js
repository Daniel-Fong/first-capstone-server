const express = require('express')
const PlayersService = require('./players-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const playersRouter = express.Router()
const jsonBodyParser = express.json()

playersRouter
    .route('/:game_id')
    .get(requireAuth, (req, res, next) => {
        PlayersService.getPlayersByGameId(req.app.get('db'), req.params.game_id)
            .then(players => {
                res.json(players)
            })
            .catch(next)
    })

playersRouter
    .route('/:player_id')
    .delete(requireAuth, (req, res, next) => {
        PlayersService.deletePlayerById(req.app.get('db'), req.params.player_id)
            .then(player => {
                if(!player) {
                    return res.status(404).json({
                        error: {message: 'Player does not exist'}
                    });
                }
                res
                    .status(204)
                    .end()
            })
    })

    .post(requireAuth, (req, res, next) => {
        const { userid, name, notes } = req.body
        const newPlayer = { userid, name, notes}
        if(!name) {
            return res
                .status(400)
                .json({ error: { message: 'Player name required'}
            })
        }
        PlayersService.insertPlayer(req.app.get('db'), newPlayer)
            .then(player => {
                res
                    .status(200)
                    .location(path.posix.join(req.originalUrl, `/${player.id}`))
                    .json(player)
            })
    })

module.exports = playersRouter;