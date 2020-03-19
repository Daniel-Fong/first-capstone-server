const express = require('express')
const PigService = require('./pig-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const pigRouter = express.Router()
const jsonBodyParser = express.json()

pigRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { playerid, gameid } = req.body  
        const newPIG = { playerid, gameid }
        PigService.insertPIG(req.app.get('db'), newPIG)
        .then(pig => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${pig.id}`))
                .json(pig)
        })
    .catch(next)
})

pigRouter
    .route('/:game_id')
    .get(requireAuth, (req, res, next) => {
        PigService.getPIGByGameId(req.app.get('db'), req.params.game_id)
        .then(pig => {
            return res 
                .status(200)
                .json(pig)
        })
    })

pigRouter
    .route('/:game_id/:player_id')
    .delete(requireAuth, (req, res, next) => {
        PigService.deletePIG(req.app.get('db'), req.params.player_id, req.params.game_id)
        .then(pig => {
            if(!pig) {
                return res.status(404).json({
                    error: {message: 'PIG does not exist'}
                });
            }
            res
                .status(204)
                .end()
        })
        .catch(next)
})

module.exports = pigRouter