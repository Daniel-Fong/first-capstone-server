const GamesService = {
    getAllGames(db) {
        return db
            .from('games as gam')
            .select('*')
    },

    getById(db, id) {
        return GamesService.getAllGames(db)
            .where('gam.id', id)
            .first()
    }
}