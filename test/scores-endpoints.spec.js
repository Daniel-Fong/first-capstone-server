const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
require('dotenv').config()

describe('Scores Endpoints', function() {
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
        beforeEach('insert scores', () => {
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
                name: 'GET /api/scores/:game_id/:player_id',
                path: '/api/scores/1/1'
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
    describe(`GET /api/scores/:game_id/:player_id`, () => {
        context(`Given no scorees`, () => {
            before('insert scores', () =>
              helpers.seedUsers(
                db,
                testUsers
              )
            )

            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                .get('/api/scores/1/1')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(200, [])
            })
        context('Given there are scores in the database', () => {
            beforeEach('insert scores', () =>
              helpers.seedSnapshotTables(
                db,
                testUsers,
                testGames,
                testPlayers,
                testScores,
                testPIG
              )
            )
        
            it('responds with 200 and all of the scores', () => {
              const expectedScores = testScores.map(score =>
                helpers.makeExpectedScore(score)
              )
              return supertest(app)
                .get('/api/scores/1/1')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .expect(200, expectedScores)
            })
        })
        })
        describe(`POST /api/pig`, () => {
            context('given valid pig data', () => {
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
                it('responds with 201 and new pig', () => {
                newPig = {
                    gameid: 1,
                    playerid: 1
                }
                return supertest(app)
                .post('/api/pig')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                .send(newPig)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.playerid).to.eql(newPig.playerid)
                    expect(res.body.gameid).to.eql(newPig.gameid)
                })
            })
        })
        })

        describe(`DELETE /api/scores/:score_id`, () => {
            context(`Given no score`, () => {
                before('insert users', () =>
                  helpers.seedUsers(
                    db,
                    testUsers
                  )
                )
                it(`responds with 404 not found`, () => {
                    return supertest(app)
                    .delete('/api/scores/1')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                    .expect(404)
                })
            })
            context('Given the score exists', () => {
                beforeEach('insert scores', () =>
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
                    .delete(`/api/scores/${testScores[0].id}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0], process.env.JWT_SECRET))
                    .expect(204)
                })
            })
            })
    })
})