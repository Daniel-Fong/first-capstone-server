const scoresService = {
    getScoresByGameIdAndPlayerId(db, gameId, playerId) {
        return db
            .from('scores as score')
            .where('score.gameid', gameId)
            .andWhere('score.playerid', playerId)
            .select('*')
    },

    insertScore(db, newScore) {
        return db
            .insert(newScore)
            .into('scores')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
}

module.exports = scoresService;