export function toProperCase (piece: string) {
    let update = piece
    switch (piece) {
        case 'p':
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
            break;
    }
    return update
}

export function lastMove (color: string, history: Array<object>) {
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