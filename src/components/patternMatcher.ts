import type { Chess, Board, Pattern, PieceSymbol, Color, Square, SquareState } from '../chess'
import { adjacentSquares, findPiece } from './helpers'

function squareStateToString (squareState: SquareState) {
    if ( squareState !== undefined ) {
        const piece = squareState?.type
        const color = squareState?.color

        return color as string + piece as string
    } else {
        return undefined
    }
}

function getSquares( square: Square ) {
    const squares = adjacentSquares( square ) as Array<string>
    console.log(squares)
    const tc = square[0]
    const tr = square[1]
    let offset = 0

    if ( tc === 'a' ) {
        squares.unshift('w', 'w', 'w')
        offset += 2
    }
    if ( tr === '8' ) {
        squares.unshift('w')
        squares.splice(3 + offset, 0, 'w')
        //squares.splice(5 + offset, 0, 'w')
    }
    if ( tr === '1' ) {
        squares.splice(2 + offset , 0, 'w')
        squares.splice(5 + offset, 0,'w')
        //squares.push('w')
    }
    if ( tc === 'h' ) {
        squares.push('w', 'w', 'w')
    }

    return squares
}

function boardToPattern (board: Board, centerPiece: SquareState) {
    if ( centerPiece ) {
        const pattern = [] as Pattern
        const centerPieceString = squareStateToString(centerPiece)

        if ( centerPieceString !== undefined ) {
            const squares = getSquares( centerPiece.square )
            squares.splice(4,0,centerPieceString)
            console.log(squares)
        }
    return pattern
    }
}

export default function patternMatcher( game: Chess, piece: PieceSymbol, color: Color, pattern: Pattern) {
    const board = game.board()
    const centerPieceSquare: Square | undefined = findPiece(board, piece, color)

    if ( centerPieceSquare !== undefined ) {
        const centerPiece: SquareState = {square: centerPieceSquare, type: piece, color: color}

        const boardPattern = boardToPattern(board, centerPiece)
        console.log(boardPattern)
    }
}