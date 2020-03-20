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
        .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { score, note } = req.body
        const playerid = req.params.player_id
        const gameid = req.params.game_id
        const newScore = { playerid, gameid, score, note }
        ScoresService.insertScore(req.app.get('db'), newScore)
            .then(score => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${score.id}`))
                    .json(score)
            })
            .catch(next)
    })

scoresRouter
    .route('/:score_id')
    .delete(requireAuth, (req, res, next) => {
        ScoresService.deleteScoreById(req.app.get('db'), req.params.score_id)
            .then(score => {
                if(!score) {
                    return res.status(404).json({
                        error: {message: 'score does not exist'}
                    })
                }
            res
            .status(204)
            .end()
            })
            .catch(next)
    })

module.exports = scoresRouter