const express = require('express')
const ScoresService = require('./scores-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const scoresRouter = express.Router()
const jsonBodyParser = express.json()

scoresRouter
    .route('/:game_id/:player_id')
    .get(requireAuth, (req, res, next) => {
        ScoresService.getScoresByGameIdAndPlayerId(req.app.get('db'), req.params.game_id, req.params.player_id)
        .then(scores => {
            return res 
                .status(200)
                .json(scores)
        })
    })

module.exports = scoresRouter