const express = require('express')
const PlayersService = require('./players-service')

const playersRouter = express.Router()

playersRouter
    .route('/:game_id')
    .get((req, res, next), () => {
        PlayersService.getPlayersByGameId(req.app.get('db'), req.params.game_id)
            .then(players => {
                res.json(players)
            })
            .catch(next)
    })

playersRouter
    .route('/:player_id')
    .delete((req, res, next), () => {
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

module.exports = playersRouter;