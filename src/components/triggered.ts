import { Chess, Color, Square } from "chess.js";
import { adjacentSquares, attackedSquares, findPiece, opponent } from "./helpers";
import findChecks from "./findChecks";

function whichColor (game: Chess, player: string) {
    const userColor = game.turn()
    const opponent = userColor === 'w' ? 'b' : 'w'

    return player === 'user' ? userColor : opponent
}

export default function triggered(game: Chess, triggers: Array<object>): boolean {
    let color = '' as Color
    let opp = '' as Color
    let square = '' as Square
    let adjacent = [] as Array<Square>
    let attacked = [] as Array<Square>

    let result = false

    triggers.forEach(test => {
        switch (test.kind) {
            case 'adjacent attacked squares':
                color = whichColor(game, test.player)
                opp = opponent( color )
                square = findPiece(game.board(), test.piece, color)
                adjacent = adjacentSquares( square )
                attacked = attackedSquares( game, adjacent, opp )
                
                if ( attacked.length >= test.min ) {
                    result = true
                }
                break
            case 'opponent adjacent attacked squares':
                break

            case 'checks':
                if ( findChecks(game).length > 0 ) {
                    result = true
                }
                break
                
        }
    })
    
    return result
}