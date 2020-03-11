const UsersService = {
    getAllUsers(db) {
        return db
            .from('users as user')
            .select('*');
    },

    getById(db, id) {
        return UsersService.getAllUsers(db)
            .where('user.id', id)
            .select('*');
    },

    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
};

module.exports = UsersService;