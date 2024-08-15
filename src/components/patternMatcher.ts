import type { Chess, Board, Pattern, PieceSymbol, Color, Square, SquareState } from '../chess'
import { adjacentSquares, findPiece, opponent } from './helpers'

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
    
    const tc = square[0]
    const tr = square[1]
    let offset = 0

    if ( tc === 'a' ) {
        squares.unshift('w', 'w', 'w')
        offset += 2
    }
    if ( tr === '8' ) {
        if ( tc !== 'a' ) {
            squares.unshift('w')
        }
        squares.splice(3 + offset, 0, 'w')
        squares.splice(5 + offset, 0, 'w')
    }
    if ( tr === '1' ) {
        squares.splice(2 + offset , 0, 'w')
        squares.splice(4 + offset, 0,'w')
        if ( tc !== 'h' ) {
            squares.push('w')
        }
    }
    if ( tc === 'h' ) {
        squares.push('w', 'w', 'w')
    }

    return squares
}

function populateSquares ( game: Chess, squares: Array<string> , centerPieceString: string) {
    const newSquares = squares.map((sq) => {
        if ( sq === 'w' || sq === centerPieceString ) {
            return sq
        } else {

            let occupant = game.get(sq as Square)
            
            if ( occupant ) {
                let squareState: SquareState = { square: sq, type: occupant.type, color: occupant.color }
                return squareStateToString(squareState)
                
            } else {
                return sq + 'o'
            }
        }
    })

    return newSquares
}

function boardToPattern (game: Chess, centerPiece: SquareState) {
    if ( centerPiece ) {
        let pattern = [] as Array<string | undefined>
        const centerPieceString = squareStateToString(centerPiece)

        if ( centerPieceString !== undefined ) {
            const squares = getSquares( centerPiece.square )
            squares.splice(4,0,centerPieceString)
            
            const populatedSquares = populateSquares(game, squares, centerPieceString)
            
            if ( populatedSquares ) {
                pattern = populatedSquares.map((sq) => {
                    if ( sq?.charAt(2) === 'o' ) {
                        
                        if ( game.isAttacked( sq.substring(0,2) as Square, opponent(centerPiece.color))) {
                            
                            return 'AA'
                        } else {
                            return 'OO'
                        }
                    } else {
                        return sq
                    }
                })
            }
        }

    return pattern
    } else {
        return undefined
    }
}

export default function patternMatcher( game: Chess, piece: PieceSymbol, color: Color, pattern: Pattern) {
    const board = game.board()
    const centerPieceSquare: Square | undefined = findPiece(board, piece, color)

    if ( centerPieceSquare !== undefined ) {
        const centerPiece: SquareState = {square: centerPieceSquare, type: piece, color: color}

        const boardPattern = boardToPattern(game, centerPiece)
        console.log(boardPattern)
    }
}