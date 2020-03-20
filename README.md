Snapshot

This is the server for the Snapshot application for saving the scores and states of physical games. 

Link to deployed version: https://thawing-shelf-83199.herokuapp.com/

Link to client side code: https://github.com/Daniel-Fong/first-capstone-client/

Tech Stack: Reactjs, CSS3, NODE.js, SQL, PostgresQL

For this server, the code has been divided into several foders detailing tests and different express routes. The 'middleware' and 'test' folders contain middleware and tests respectively, and each other folder in the src directory contains a router and service object for the named route. Outside of the main code in the src directory there is also a migrations folder containing the migrations for the project's tables, and a seeds folder containing some seed data for the tables. 

REST API

For all endpoints: 'Accept: application/json'

Get list of games

GET '/games'
Response
Status: 200 OK
[]

Add a game

POST '/games'
Body: {
  "name": "foo",
  "notes": "bar"
}
Response
Status: 201 Created
{"id": 1, "name": "foo", "notes": "bar", "userid": 1}

Get a game

GET '/games/:game_id'
Request: '/games/1'
Response
If no game: Status: 404 Not Found
else
Status: 200 OK
{game}

Delete a game

DELETE '/games/:game_id'
Request: '/games/1'
If no game: Status: 404 Not Found
else
Status: 204 Deleted

Get players

GET '/players'
Response
Status: 200 OK
[]

Add a player

POST '/players'
Body: {
  "name": "foo",
  "notes": "bar"
}
Response
Status: 201 Created
{"id": 1, "name": "foo", "notes": "bar", "userid": 1}

Get a player

GET '/players/:player_id'
Request: '/players/1'
Response
If no player: Status: 404 Not Found
else
Status: 200 OK
{player}

Delete a player

DELETE '/players/player/:player_id'
Request: '/players/player/1'
If no player: Status: 404 Not Found
else
Status: 204 Deleted

Add a score

POST '/scores/:game_id/:player_id'
Request '/scores/1/1'
Body: {
  "score": 20,
  "note": "bar"
}
Response
Status: 201 Created
{"id": 1, "score": "20", "note": "bar", "gameid": 1, "playerid": 1}

Get a score

GET '/scores/:game_id/:player_id'
Request: '/scores/1/1'
Response
If no score: Status: 404 Not Found
else
Status: 200 OK
{score}

Delete a score

DELETE '/scores/:score_id'
Request: '/scores/1'
If no score: Status: 404 Not Found
else
Status: 204 Deleted

Add a player in game (pig)

POST '/pig'
Body: {
  "gameid": 1,
  "playerid": "1"
}
Response
Status: 201 Created
{"id": 1, "gameid": 1, "playerid": 1}

Get pigs by gameid

GET '/pig/:game_id'
Request: '/pig/1'
Response
If no pig: Status: 404 Not Found
else
Status: 200 OK
[]

Delete a pig

DELETE '/pig/:game_id/:player_id'
Request: '/pig/1/1'
If no score: Status: 404 Not Found
else
Status: 204 Deleted
