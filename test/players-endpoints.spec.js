const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
require('dotenv').config()

describe('Players Endpoints', function() {
    let db

    const {
        testUsers,
        testGames,
        testPlayers,
        testPIG,
        testScores
    } = helpers.makeSnapshotFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.Test_DB_URL,
        })
        app.set('db', db)
    })
    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe.only(`Protected endpoints`, () => {
        beforeEach('insert games', () => {
            helpers.makeSnapshotFixtures(
                db, 
                testUsers,
                testGames,
                testPlayers,
                testPIG,
                testScores,
            )
        })
        const protectedEndpoints = [
            {
                name: 'GET /api/players',
                path: '/api/players'
            },
            {
                name: 'POST /api/players',
                path: '/api/players'
            },
            {
                name: 'GET /api/players/:player_id',
                path: '/api/players/1'
            },
            {
                name: 'GET /api/players/list/:game_id',
                path: '/api/players/list/1'
            },
        ]
        protectedEndpoints.forEach(endpoint => {
            describe(endpoint.name, () => {
                it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
                    return supertest(app)
                        .get(endpoint.path)
                        .expect(401, { error: `Missing bearer token` })
                })
                it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                    const validUser = testUsers[0]
                    const invalidSecret = 'bad-secret'
                     return supertest(app)
                       .get(endpoint.path)
                       .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                       .expect(401, { error: `Unauthorized request` })
                })
                it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                    const invalidUser = { name: 'user-not-existy', id: 1 }
                    return supertest(app)
                      .get(endpoint.path)
                      .set('Authorization', helpers.makeAuthHeader(invalidUser))
                      .expect(401, { error: `Unauthorized request` })
                })
            })
        })
    })
    describe(`GET /api/players`, () => {
        context(`Given no players`, () => {
            before('insert users', () =>
              helpers.seedUsers(
                db,
                testUsers
              )
            )

            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                .get('/api/players')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(200, [])
            })
        context('Given there are players in the database', () => {
            beforeEach('insert players', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
        
            it('responds with 200 and all of the players', () => {
              const expectedPlayers = testPlayers.map(player =>
                helpers.makeExpectedGame(player)
              )
              return supertest(app)
                .get('/api/games')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(200, expectedGames)
            })
        })
        })
    })

    describe(`POST /api/games`, () => {
        context(`Given no game name`, () => {
            beforeEach('insert games', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
            it('responds with 400 Bad Request', () => {
                const namelessGame = {
                    id: 1, 
                    name: null
                }
                return supertest(app)
                .post('/api/games')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .send(namelessGame)
                .expect(400)
            })
            
        })
        context('given valid game data', () => {
            beforeEach('insert games', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
            it('responds with 201 and new game', () => {
            newGame = {
                name: 'catan',
                notes: 'note',
                date_modified: '2020-03-16T00:35:35.346Z',
                userid: 1
            }
            return supertest(app)
            .post('/api/games')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
            .send(newGame)
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.name).to.eql(newGame.name)
                expect(res.body.notes).to.eql(newGame.notes)
                expect(res.body).to.have.property('date_modified')
                expect(res.body).to.have.property('userid')
            })
        })
    })
    })

    describe(`GET /api/games/:game_id`, () => {
        context(`Given no game`, () => {
            before('insert users', () =>
              helpers.seedUsers(
                db,
                testUsers
              )
            )
            it(`responds with 404 not found`, () => {
                return supertest(app)
                .get('/api/games/1')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(404)
            })
        context('Given the game exists', () => {
            beforeEach('insert games', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
            it('responds with 200 and the test game', () => {
              const expectedGame = helpers.makeExpectedGame(testGames[0])
              return supertest(app)
                .get(`/api/games/${testGames[0].id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(200, expectedGame)
            })
        })
        })
    })

    describe(`DELETE /api/games/:game_id`, () => {
        context(`Given no game`, () => {
            before('insert users', () =>
              helpers.seedUsers(
                db,
                testUsers
              )
            )
            it(`responds with 404 not found`, () => {
                return supertest(app)
                .delete('/api/games/1')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(404)
            })
        })
        context('Given the game exists', () => {
            beforeEach('insert games', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
            it('responds with 204', () => {
              return supertest(app)
                .delete(`/api/games/${testGames[0].id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(204)
            })
        })
        })
})