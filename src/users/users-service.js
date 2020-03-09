const UsersService = {
    getAllUsers(db) {
        return db
            .from('users as user')
            .select('*')
    },

    getById(db, id) {
        return UsersService.getAllUsers(db)
            .where('user.id', id)
            .select('*')
    },
}