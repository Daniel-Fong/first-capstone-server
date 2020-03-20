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
    {
      id: 1,
      name: 'testGame',
      notes: 'some notes',
      date_modified: '2020-03-16T00:35:35.346Z',
      userid: 1
    },
  ]
}

function makePlayersArray() {
  return [
    {
      id: 1,
      userid: 1, 
      name: 'testPlayer',
      notes: 'some more notes',
    },
  ]
}

function makeScoresArray() {
  return [
    {
      id: 1,
      gameid: 1, 
      playerid: 1,
      score: 25,
      note: 'its a note'
    },
  ]
}

function makePigArray() {
  return [
    {
      id: 1,
      playerid: 1,
      gameid: 1,
    },

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

  function makeExpectedGame(game) {
  
    return {
      id: game.id,
      name: game.name,
      notes: game.notes,
      date_modified: game.date_modified,
      userid: game.userid
    }
  }

  function makeExpectedScore(score) {
  
    return {
      id: score.id,
      score: score.score,
      note: score.note,
      playerid: score.playerid,
      gameid: score.gameid
    }
  }

  function makeExpectedPIG(pig) {
  
    return {
      id: pig.id,
      playerid: pig.playerid,
      gameid: pig.gameid
    }
  }

  function makeExpectedPlayer(player) {
  
    return {
      id: player.id,
      name: player.name,
      notes: player.notes,
      userid: player.userid
    }
  }

  function makeExpectedPlayerForGame(player) {
  
    return {
      id: player.id,
      name: player.name,
      notes: player.notes,
      userid: player.userid,
      gameid: 1,
      playerid: player.id
    }
  }

  function seedSnapshotTables(db, users, games, players=[], scores=[], pig=[] ) {
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('games').insert(games)
      await trx.raw(
        `SELECT setval('games_id_seq', ?)`,
        [games[games.length - 1].id],
      )
      if(players.length) {
        await trx.into('players').insert(players)
        await trx.raw(
          `SELECT setval('players_id_seq', ?)`,
          [players[players.length - 1].id],
      )}
      if(scores.length) {
        await trx.into('scores').insert(scores)
        await trx.raw(
          `SELECT setval('scores_id_seq', ?)`,
          [scores[scores.length - 1].id],
      )}
      if(pig.length) {
        await trx.into('players_in_game').insert(pig)
        await trx.raw(
          `SELECT setval('players_in_game_id_seq', ?)`,
          [pig[pig.length - 1].id],
      )}
    })
  }

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ id: user.id }, secret, {
        subject: user.name,
        algorithm: 'HS256',
      })
    return `Bearer ${token}`
  }

  module.exports = {
      seedUsers,
      makeSnapshotFixtures,
      cleanTables,
      makeUsersArray,
      makeGamesArray,
      makePigArray,
      makePlayersArray,
      makeScoresArray,
      makeAuthHeader,
      seedSnapshotTables,
      makeExpectedGame,
      makeExpectedPlayer,
      makeExpectedPlayerForGame,
      makeExpectedScore,
      makeExpectedPIG

  }