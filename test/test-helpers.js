const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'test',
            password: 'password',
            admin: true
        },
        {
            id: 2,
            name: 'test2',
            password: 'pw',
            admin: false
        },
        {
            id: 3,
            name: 'test3',
            password: 'insecure',
            admin: false
        },
    ]
}

function makeGamesArray(user) {
  return [

  ]
}

function makePlayersArray() {
  return [

  ]
}

function makeScoresArray() {
  return [

  ]
}

function makePigArray() {
  return [

  ]
}

function cleanTables(db) {
    return db.raw(
      `TRUNCATE
        users,
        games,
        players,
        scores,
        players_in_game
        RESTART IDENTITY CASCADE`
    )
  }

  function makeSnapshotFixtures() {
    const testUsers = makeUsersArray()
    const testGames = makeGamesArray(testUsers)
    const testPlayers = makePlayersArray(testUsers)
    const testScores = makeScoresArray(testGames, testPlayers)
    const testPIG = makePigArray(testPlayers, testGames)
    return { testUsers, testGames, testPlayers, testScores, testPIG }
  }

  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }

  module.exports = {
      seedUsers,
      makeSnapshotFixtures,
      cleanTables,
      makeUsersArray,
  }