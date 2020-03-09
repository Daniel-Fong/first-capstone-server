const app = require('./app');
const { PORT } = require('./config');

const db = knex({
    client: 'pg',
    connection: DB_URL,
})

app.set('db', db)

app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`));