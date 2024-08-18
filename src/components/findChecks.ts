import { Chess } from 'chess.js'

export default function findChecks(game: Chess) {
    const trial = game
    const moves = game.moves()

    const checkMoves = moves.filter(move => {
        const mo = trial.move(move)
        console.log('move object', mo)
        if ( mo ) {
            console.log( mo )
            if ( trial.inCheck() === true ) {
                return mo
            }
        }
    })

    console.log('check moves', checkMoves.length)
    return checkMoves
}