const GamesService = {
    getAllGames(db) {
        return db
            .from('games as game')
            .select('*')
    },

    getById(db, id) {
        return GamesService.getAllGames(db)
            .where('game.id', id)
            .first()
    },
    
    getByUserId(db, id) {
        return GamesService.getAllGames(db)
            .where('game.userid', id)
            .select('*')
    },
}