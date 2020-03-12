const scoresService = {
    getScoresByGameIdAndPlayerId(db, gameId, playerId) {
        return db
            .from('scores')
            .where('score.gameid', gameId)
            .and('score.playerid', playerId)
            .select('*')
    },
}

module.exports = scoresService;