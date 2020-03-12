const express = require('express')
const ScoresService = require('./scores-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const playersRouter = express.Router()
const jsonBodyParser = express.json()