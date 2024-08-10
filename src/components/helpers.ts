import type { Color, PieceSymbol, Move, Square, SquareState } from '../chess.d.ts'

export function toDisplayCase ( piece: PieceSymbol ): string {
    let display: string
    switch (piece) {
        case 'p':
            display = 'p'
            break;
        case 'k':
            display = 'K'
            break;
        case 'q':
            display = 'Q'
            break;
        case 'r':
            display = 'R'
            break;
        case 'b':
            display = 'B'
            break;
        case 'n':
            display = 'N'
            break;
        default:
            throw new Error('Unknown Input')
    }
    
    return display 
}

export function lastMove ( history: Array<Move>):Move {
    let offset = -1
    return history[history.length + offset]
}

export function isWhitePiece (piece: string) { return /^w/.test(piece) }
export function isBlackPiece (piece: string) { return /^b/.test(piece) }

export function whereIsPiece (board:Array<Array<SquareState>>, type: PieceSymbol, color: Color):Square | undefined {
    let playerPieces: Array<SquareState> = []

    board.forEach((row: Array<SquareState>) => {
        Object.values(row).forEach(entry => {
            if ( entry ) {
                if ( entry.color === color ) {
                    playerPieces.push(entry)
                }
            }                
        })
    })
    
    const found = Object.values(playerPieces).find(entry => {
        return entry ? (entry.type == type) : undefined
    })
    
    return found ? found.square : undefined
}