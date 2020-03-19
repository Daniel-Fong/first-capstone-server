const PlayersService = {
    getAllPlayers(db) {
        return db
            .from('players as player')
            .select('*');
    },
    
    getPlayersByGameId(db, id) {
        return(db)
            .from('players_in_game')
            .where('players_in_game.gameid', id)
            .innerJoin('players', 'players.id', '=', 'players_in_game.playerid')
            .select('*');
    },

    getPlayersByUserId(db, id) {
        return PlayersService.getAllPlayers(db)
            .where('player.userid', id)
            .select('*')
    },

    deletePlayerById(db, id) {
        return db
            .from('players')
            .where('id', id)
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