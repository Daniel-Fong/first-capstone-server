const PlayersService = {
    getAllPlayers(db) {
        return db
            .from('players as player')
            .select('*');
    },
    
    getPlayersByGameId(db, id) {
        return PlayersService.getAllPlayers(db)
            .where('player.gameid', id)
            .select('*');
    },

    deletePlayerById(db, id) {
        return db
            .from('players')
            .where({ id })
            .delete();
    },
    insertPlayer(db, newPlayer) {
        return db
            .insert(newPlayer)
            .into('players')
            .returning('*')
            .then(rows => {
                return rows[0]
            })

    },
};

module.exports = PlayersService;