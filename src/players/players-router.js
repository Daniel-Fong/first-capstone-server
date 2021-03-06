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
    .route('/player/:player_id')
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
            .catch(next)
    })

playersRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        PlayersService.getPlayersByUserId(req.app.get('db'), req.user.id)
        .then(players => {
            return res 
                .status(200)
                .json(players)
        })
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { name, notes } = req.body
        const userid = req.user.id
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
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${player.id}`))
                    .json(player)
            })
        .catch(next)
    })

playersRouter
    .route('/list/:game_id')
    .get(requireAuth, (req, res, next) => {
        PlayersService.getPlayersByNotInGame(req.app.get('db'), req.params.game_id)
        .then(players => {
            res
                .status(200)
                .json(players)
        })
        .catch(next)
    })

module.exports = playersRouter;