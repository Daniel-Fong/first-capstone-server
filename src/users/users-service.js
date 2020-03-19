const UsersService = {
    getAllUsers(db) {
        return db
            .from('users as user')
            .select('*');
    },

    getById(db, id) {
        return db
            .select('name')
            .from('users as user')
            .where('user.id', id);
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