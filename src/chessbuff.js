import { getBestMove } from "./chessIA.js"

const COLOROPP = "white"
const COLOR = "black"


const board = document.getElementsByTagName('cg-board')[0]
const white = board.getElementsByClassName('white')
const black = board.getElementsByClassName('black')

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

    if (COLOROPP === color) {
        const pieces = getBoard()
        const bestMove = getBestMove(COLOR, pieces)
        console.log(bestMove)
    }
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