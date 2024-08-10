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

export function adjSquares(square: Square | undefined): Array<Square> | undefined {
    if ( square ) {
        const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
        const rows = ['1', '2', '3', '4', '5', '6', '7', '8']
        const adjSquares = [] as Array<Square>
        const tryRows = [] as Array<string>
        const tryCols = [] as Array<string>
    
        const col = square.charAt(0)
        const row = square.charAt(1)

        if ( row !== '8') { 
            tryRows.push( rows[ rows.indexOf( row ) + 1 ] )
        }
        tryRows.push( row )
        if ( row !== '1' ) {
            tryRows.push( rows[ rows.indexOf( row ) - 1 ] )
        }

        if ( col !== 'a' ) {
            tryCols.push( cols[ cols.indexOf( col ) - 1 ] )
        }
        tryCols.push( col )
        if ( col !== 'g' ) {
            tryCols.push( cols[ cols.indexOf( col ) + 1 ] )
        }

        tryCols.forEach( col => {
            tryRows.forEach( row => {
                let trySquare = (col + row) as Square
                adjSquares.push(trySquare)
            })
        })

        return adjSquares.filter( sq => {
            return sq !== square
        })
    }
    return undefined
}