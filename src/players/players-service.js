const PlayersService = {
    getAllPlayers(db) {
        return db
            .from('players as player')
            .select('*')
    },
    
    getAllPlayersByGameId(db, id) {
        return PlayersService.getAllPlayers(db)
            .where('player.gameid', id)
            .select('*')
    },
}