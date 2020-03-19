const PigService = {
    insertPIG(db, newPIG) {
        return db
            .insert(newPIG)
            .into('players_in_game')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    deletePIG(db, playerid, gameid) {
        return db
            .from('players_in_game')
            .where('playerid', playerid)
            .andWhere('gameid', gameid)
            .delete();
    },
    getPIGByGameId(db, gameid) {
        return db
            .from('players_in_game')
            .where('gameid', gameid)
            .select('*');
    },
}

module.exports = PigService