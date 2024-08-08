import { Color, Chesspiece, Move, Square, SquareState } from '../chess'

export function toProperCase (piece: string): Chesspiece {
    let update: Chesspiece
    switch (piece) {
        case 'p':
            update = 'p'
            break;
        case 'k':
            update = 'K'
            break;
        case 'q':
            update = 'Q'
            break;
        case 'r':
            update = 'R'
            break;
        case 'b':
            update = 'B'
            break;
        case 'n':
            update = 'N'
            break;
        default:
            throw new Error('Unknown Input')
    }
    
    return update 
}

export function lastMove (color: Color, history: Array<Move>) {
    history.reverse()

    for (const move of history) {
        if (move.color == color) {
            move.piece = toProperCase(move.piece)
            return move
        }
    }
    return ''
}

export function isWhitePiece (piece: string) { return /^w/.test(piece) }
export function isBlackPiece (piece: string) { return /^b/.test(piece) }

export function whereIsPiece (board:Array<SquareState>, color: Color, piece: Chesspiece):Square {
    let playerPieces:Array<SquareState> = []
    let type = piece.toLowerCase()

    board.forEach((row) => {
        Object.values(row).forEach(entry => {
            if ( entry !== null ) {
                if ( entry.color === color ) {
                    playerPieces.push(entry)
                }
            }
            
        })
    })
    
    const found = Object.values(playerPieces).find(entry => {
        return entry.type === type
    })
    
    if ( found == undefined ) {
        throw new Error('found undefined.')
    }
    console.log(found.square)
    return found.square
}