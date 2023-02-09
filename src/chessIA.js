const jsChessEngine = require('js-chess-engine')
const { Game, move, status, moves, aiMove, getFen } = jsChessEngine
const game = new Game()

function getBestMove(color, pieces) {
    console.log('Computing the best move...')
    // ai level 3 (best)
    return aiMove(getConfiguration(color, pieces), 3)
}

function getConfiguration(color, pieces) {
    return {
        "turn": color,
        "pieces": pieces,
//        "moves": {
//            "E8": ["E7", "F8", "F7", "D8", "D7"]
//        },
        "isFinished": false,
        "check": false,
        "checkMate": false,
        "castling": {
            "whiteLong": true,
            "whiteShort": true,
            "blackLong": true,
            "blackShort": true
        },
        "enPassant": null,
        "halfMove": 0,
        "fullMove": 1
    }
}

export { getBestMove }