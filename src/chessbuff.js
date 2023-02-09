import { getBestMove } from "./chessIA.js"

const COLOROPP = "black"
const COLOR = "white"


const board = document.getElementsByTagName('cg-board')[0]
const white = board.getElementsByClassName('white')
const black = board.getElementsByClassName('black')

let bestMove = {"A1": "A1"};

// add an event mutation for each chess piece

for (let i = 0; i < white.length; i++) {
    white.item(i).addEventListener('DOMAttrModified', onMutation)
    setPos(white.item(i))
}

for (let i = 0; i < black.length; i++) {
    black.item(i).addEventListener('DOMAttrModified', onMutation)
    setPos(black.item(i))
}

function onMutation(e) {
    if (!e.newValue.includes('dragging') && !e.newValue.includes('anim') && e.attrName === 'class') {
        // detect if the piece moved
        // add a delay for the moving animation
        setTimeout(() => {

            let newPos = getPos(e.target)
            let oldPos = {
                x: parseInt(e.target.getAttribute('x')),
                y: parseInt(e.target.getAttribute('y'))
            }

            if (newPos.x !== oldPos.x || newPos.y !== oldPos.y) {
                setPos(e.target);
                pieceMoved(oldPos, newPos, e.target.classList[1], e.target.classList[0])
            }

        }, 100)
    }
}

function getPos(element) {
    const pos = element.style.transform.split('(')[1].replace(')', '').split(',')
    let posX = parseInt(element.style.transform.split('(')[1].split(',')[0].replace('px', ''))
    let posY = 0;
    if (pos.length > 1)
        posY = parseInt(element.style.transform.split('(')[1].split(',')[1].replace('px', '').replace(')', ''))

    return {x: posX, y: posY}
}

function setPos(element) {
    const pos = getPos(element)

    element.setAttribute('x', pos.x);
    element.setAttribute('y', pos.y);
}

function pieceMoved(oldPos, newPos, pieceName, color) {
    console.log(`[${color}] ${pieceName} : (${oldPos.x}, ${oldPos.y}) -> (${newPos.x}, ${newPos.y})`)
    pinBest(false, 0, 0)

    if (COLOROPP === color) {
        const pieces = getBoard()
        bestMove = getBestMove(COLOR, pieces)
        console.log(bestMove)
    } else {
        const oldCoord = getCoordinate(color, oldPos.x, oldPos.y)
        if (Object.keys(bestMove).includes(oldCoord)) {
            if (bestMove[oldCoord] === getCoordinate(color, newPos.x, newPos.y)) {
                console.log("Best move !")
                pinBest(true, newPos.x, newPos.y)
            }
        }
    }
}

function pinBest(visible, x, y) {
    if (!document.getElementById('bestPin')) {
        const starPin = '<svg id="bestPin" width="26" height="26" viewBox="0 0 18 19"><g id="best"><path class="icon-shadow" opacity="0.3" d="M9,.5a9,9,0,1,0,9,9A9,9,0,0,0,9,.5Z"></path><path class="icon-background" fill="#96bc4b" d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"></path><path class="icon-component-shadow" opacity="0.2" d="M9,3.43a.5.5,0,0,0-.27.08.46.46,0,0,0-.17.22L7.24,7.17l-3.68.19a.52.52,0,0,0-.26.1.53.53,0,0,0-.16.23.45.45,0,0,0,0,.28.44.44,0,0,0,.15.23l2.86,2.32-1,3.56a.45.45,0,0,0,0,.28.46.46,0,0,0,.17.22.41.41,0,0,0,.26.09.43.43,0,0,0,.27-.08l3.09-2,3.09,2a.46.46,0,0,0,.53,0,.46.46,0,0,0,.17-.22.53.53,0,0,0,0-.28l-1-3.56L14.71,8.2A.44.44,0,0,0,14.86,8a.45.45,0,0,0,0-.28.53.53,0,0,0-.16-.23.52.52,0,0,0-.26-.1l-3.68-.2L9.44,3.73a.46.46,0,0,0-.17-.22A.5.5,0,0,0,9,3.43Z"></path><path class="icon-component" fill="#fff" d="M9,2.93A.5.5,0,0,0,8.73,3a.46.46,0,0,0-.17.22L7.24,6.67l-3.68.19A.52.52,0,0,0,3.3,7a.53.53,0,0,0-.16.23.45.45,0,0,0,0,.28.44.44,0,0,0,.15.23L6.15,10l-1,3.56a.45.45,0,0,0,0,.28.46.46,0,0,0,.17.22.41.41,0,0,0,.26.09.43.43,0,0,0,.27-.08l3.09-2,3.09,2a.46.46,0,0,0,.53,0,.46.46,0,0,0,.17-.22.53.53,0,0,0,0-.28l-1-3.56L14.71,7.7a.44.44,0,0,0,.15-.23.45.45,0,0,0,0-.28A.53.53,0,0,0,14.7,7a.52.52,0,0,0-.26-.1l-3.68-.2L9.44,3.23A.46.46,0,0,0,9.27,3,.5.5,0,0,0,9,2.93Z"></path></g></svg>'
        document.getElementsByTagName('cg-board')[0].innerHTML += starPin
    }

    document.getElementById('bestPin').style.transform = `translate(${x}px, ${y}px)`
    document.getElementById('bestPin').style.visibility = (visible ? 'visible' : 'hidden')
}

function getBoard() {
    const tileSize = document.getElementsByTagName('cg-container')[0].clientWidth / 8;
    const boardDOM = document.getElementsByTagName('cg-board')[0]
    const piecesDOM = boardDOM.getElementsByTagName('piece');

    const pieces = {}

    for (let i = 0; i < piecesDOM.length; i++) {
        let piececode = piecesDOM.item(i).classList[1][0];

        if (piecesDOM.item(i).classList[1] === "knight") piececode = "n";
        if (piecesDOM.item(i).classList.contains('white')) piececode = piececode.toUpperCase()

        if (COLOR === "white") {
            pieces[
                String.fromCharCode("A".charCodeAt(0) + parseInt(piecesDOM.item(i).getAttribute('x'))/tileSize) +
                (8 - parseInt(piecesDOM.item(i).getAttribute('y'))/tileSize)
            ] = piececode
        } else {
            // the board is reversed if you are playing the blacks
            pieces[
                String.fromCharCode("H".charCodeAt(0) - parseInt(piecesDOM.item(i).getAttribute('x'))/tileSize) +
                (parseInt(piecesDOM.item(i).getAttribute('y'))/tileSize + 1)
            ] = piececode
        }
    }

    return pieces
}

function getCoordinate(color, x, y) {
    let coord
    const tileSize = document.getElementsByTagName('cg-container')[0].clientWidth / 8;

    if (COLOR === "white") {
        coord = (String.fromCharCode("A".charCodeAt(0) + x/tileSize)) +
        (8 - y/tileSize)
    } else {
        // the board is reversed if you are playing the blacks
        coord = (String.fromCharCode("H".charCodeAt(0) - x/tileSize)) +
        (y/tileSize + 1)
    }

    return coord
}