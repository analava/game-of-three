# Game of Three, Code Challenge
### (Backend - nodejs)
A game with two independent units – the players – communicating with each other using an API.
# Description
When a player starts, it incepts a random (whole) number and sends it to the second player as an approach of starting the game.
The receiving player can now always choose between adding one of {-1, 0, 1} to get
to a number that is divisible by 3. Divide it by three. The resulting whole number is then sent back to the original sender.
The same rules are applied until one player reaches the number 1 (after the division).
Both players should be able to play automatically without user input. One of the players should optionally be adjustable by a user.
# Setup
To setup the environment you need to have `docker` and `docker-compose` installed.
Then you are able to run the program with the command:
```
docker-compose -f Docker-compose.yml up -d
```
You can check whether your application is up and running or not, by requesting:
```
localhost:3000/api/v1/sup
```    
and getting the response 'Nothing'!!
# API
## Start a Game 
To start a game, send a ***POST*** request to:
```
localhost:3000/api/v1/game
```
#### Body:
| Parameter | type | Description |
| ------ | ------ | ------ |
| playerName | String| The name of the player who starts the game (In case it is a human) |
| kind * | String| The kind of game which is going to be started: (`AUTOMATIC`, `SINGLE-PLAYER` or `MULTI-PLAYER`) |
| initialNumber | Number| The number which the first player starts the game with. If no number is initiated, a random number between 50 to 100 is generated |
| nextPlayer | String| The name or id of the player who the current player wants to play with (In case of MULTI-PLAYER games) |
| goal | Number | The number which the numbers are divided by. The default goal is 3. |

* Here * means required
* There are 3 kinds of game: 

    | gameKind | Description |
    | ------ | ------ |
    | AUTOMATIC | Two machine-players play the game automatically and the response is generated after game starts.|
    | SINGLE-PLAYER | A Human player plays the game with a machine player |
    | MULTI-PLAYER| Two Human players play together|
#### Sample Response:
```json
{
    "data": {
        "game": "5e67e2c2023080190cb1a45c",
        "player": "5e67e2c2023080190cb1a45a",
        "nextPlayer": "5e67e2c2023080190cb1a45b",
        "logs": [
            "Game started by NO_NAME_5e67e2c2023080190cb1a45a with number 56",
            "\"NO_NAME_5e67e2c2023080190cb1a45b\" moved. moved by: 1, resulting number: 19",
            "\"NO_NAME_5e67e2c2023080190cb1a45a\" moved. moved by: -1, resulting number: 6",
            "\"NO_NAME_5e67e2c2023080190cb1a45b\" moved. moved by: 0, resulting number: 2",
            "\"NO_NAME_5e67e2c2023080190cb1a45a\" moved. moved by: 1, resulting number: 1",
            "\"NO_NAME_5e67e2c2023080190cb1a45a\" is The winner"
        ],
        "moves": [
            {
                "currentNumber": 56
            },
            {
                "currentNumber": 56,
                "moveNumber": 1,
                "addedNumber": 57,
                "resultingNumber": 19
            },
            {
                "currentNumber": 19,
                "moveNumber": -1,
                "addedNumber": 18,
                "resultingNumber": 6
            },
            {
                "currentNumber": 6,
                "moveNumber": 0,
                "addedNumber": 6,
                "resultingNumber": 2
            },
            {
                "currentNumber": 2,
                "moveNumber": 1,
                "addedNumber": 3,
                "resultingNumber": 1
            }
        ]
    }
}
```
Here, **game** is the id of current game, **player** is the current player, and **nextPlayer** is the opponent. Because the game was in *AUTOMATIC* mode here, both players played until one of them won the game.
In case of a *SINGLE-PLAYER* mode, the response would be as follows:
```json
{
    "data": {
        "game": "5e6804a7023080190cb1a45f",
        "player": "5e6804a5023080190cb1a45d",
        "nextPlayer": "5e6804a5023080190cb1a45e",
        "logs": [
            "Game started by Ana with number 56",
            "\"NO_NAME_5e6804a5023080190cb1a45e\" moved. moved by: 1, resulting number: 19"
        ],
        "moves": [
            {
                "currentNumber": 56
            },
            {
                "currentNumber": 56,
                "moveNumber": 1,
                "addedNumber": 57,
                "resultingNumber": 19
            }
        ]
    }
}
```
Now, the human player should do the next move which is possible with the upcoming request.
## Make a move in the game
To make a move in the game, there exists a ***PUT*** request:
```
localhost:3000/api/v1/game/:id
```
***id*** here, is the id of the game, for instance "5e6804a7023080190cb1a45f" in the above example.
#### Headers:
To specify the player who is making the move, the player id should be put in the request header, in Authorization, later it can be replaced by a jwt token. for now the id is simply put instead.
| Parameter | Description |
| ------ | ------ | 
| Authorization | The player id of the player who wants to make the move|
for instance for the above example, the value of Authorization would be "5e6804a5023080190cb1a45d".
#### Body:
| Parameter | type | Description |
| ------ | ------ | ------ |
| moveNumber | Number | The number that the player wants to move by. For example for the goal "3", the valid input is either -1, 0 or 1. If the moveNumber is not defined by the player, it will be calculated automatically|
#### Sample Response
```json
{
    "data": {
        "logs": [
            "Game started by Ana with number 56",
            "\"NO_NAME_5e6804a5023080190cb1a45e\" moved. moved by: 1, resulting number: 19",
            "\"Ana\" moved. moved by: -1, resulting number: 6",
            "\"NO_NAME_5e6804a5023080190cb1a45e\" moved. moved by: 0, resulting number: 2"
        ],
        "moves": [
            {
                "currentNumber": 56
            },
            {
                "currentNumber": 56,
                "moveNumber": 1,
                "addedNumber": 57,
                "resultingNumber": 19
            },
            {
                "currentNumber": 19,
                "moveNumber": -1,
                "addedNumber": 18,
                "resultingNumber": 6
            },
            {
                "currentNumber": 6,
                "moveNumber": 0,
                "addedNumber": 6,
                "resultingNumber": 2
            }
        ]
    }
}
```
Here, after the move, the next player's move is done automatically and the player should continiue making moves, until someone wins the game!
#### NOTE:
In the ***MULTI-PLAYER*** mode, the moves are also done with this request one by one, by each player.
## Get a game's current status
A game's current state could be accessed via the following ***GET*** request:
```
localhost:3000/api/v1/game/:id
```
***id***, is the id of the game. This request could be useful in MULTI-PLAYER games which the players could poll and see if it is their turn or not.

## Add a player
A player can be created with the following ***POST*** request:
```
localhost:3000/api/v1/player
```
#### Body:
| Parameter | type | Description |
| ------ | ------ | ------ |
| name * | String | The name of the player|
| kind * | String | The kind of player, either `HUMAN` or `MACHINE`|

This request could be useful in MULTI-PLAYER games, for creating a player which is not starting the game, but is playing as the second player.
