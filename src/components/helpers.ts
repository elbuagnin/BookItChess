import { Color, Piece, Move } from '../chess'

export function toProperCase (piece: string): Piece {
    let update: Piece
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