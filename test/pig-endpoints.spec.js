const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
require('dotenv').config()

describe('PIG Endpoints', function() {
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
            connection: process.env.Test_DATABASE_URL,
        })
        app.set('db', db)
    })
    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`Protected endpoints`, () => {
        beforeEach('insert pigs', () => {
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
                name: 'GET /api/pig/:game_id',
                path: '/api/pig/1'
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

    describe(`GET /api/pig/:game_id`, () => {
        context('Given the pig exists', () => {
            beforeEach('insert pigs', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
            it('responds with 200 and the test pig', () => {
              const expectedPIGs = testPIG.map(pig => helpers.makeExpectedPIG(pig))
              return supertest(app)
                .get(`/api/pig/${testPIG[0].gameid}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(200, expectedPIGs)
            })
        })
    })

    describe(`DELETE /api/pig/:game_id/:player_id`, () => {
        context(`Given no pig`, () => {
            before('insert pigs', () =>
              helpers.seedUsers(
                db,
                testUsers
              )
            )
            it(`responds with 404 not found`, () => {
                return supertest(app)
                .delete('/api/pig/1/1')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(404)
            })
        })
        context('Given the pig exists', () => {
            beforeEach('insert pigs', () =>
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
                .delete(`/api/pig/${testPIG[0].gameid}/${testPIG[0].playerid}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(204)
            })
        })
        })
})