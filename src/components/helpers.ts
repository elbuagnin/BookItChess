export function toProperCase (piece: String) {
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

export function lastMove (color: String, history: Array<object>) {
    history.reverse()

    for (const move of history) {
        if (move.color == color) {
            move.piece = toProperCase(move.piece)
            return move
        }
    }
    return ''
}