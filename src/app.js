require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const gamesRouter = require('./games/games-router')
const usersRouter = require('./users/users-router')
const playersRouter = require('./players/players-router')
const authRouter = require('./auth/auth-router')
const scoresRouter = require('./scores/scores-router')
const pigRouter = require('./pig/pig-router')

const app= express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//static web server
//User Mode Authentication app.use(userMode)
app.use('/api/auth', authRouter)
app.use('/api/games', gamesRouter)
app.use('/api/pig', pigRouter)
app.use('/api/users', usersRouter)
app.use('/api/players', playersRouter)
app.use('/api/scores', scoresRouter)


app.get('/', (req, res) => {
     res
        .status(200)
        .send('Hello, world!')
});

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
     })

module.exports = app;