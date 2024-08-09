import { createPinia } from 'pinia'
import { useGameStore } from '../stores/gameStore'
import { Color, PieceSymbol, Move, Square, SquareState } from '../chess'

// store
const pinia = createPinia()
const store = useGameStore(pinia)


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

export function lastMove (color: Color, history: Array<Move>) {
    history.reverse()
    
    for (const move of history) {
        if (move.color == color) {
            return move
        }
    }
    return ''
}

export function isWhitePiece (piece: string) { return /^w/.test(piece) }
export function isBlackPiece (piece: string) { return /^b/.test(piece) }

export function whereIsPiece (type: PieceSymbol, color: Color):Square | undefined {
    if ( store.currentBoard ) {
        let playerPieces: Array<SquareState> = []

        store.currentBoard.forEach((row) => {
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
}