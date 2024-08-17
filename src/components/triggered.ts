import { Chess, Color, Square } from "chess.js";
import { adjacentSquares, attackedSquares, findPiece, opponent } from "./helpers";

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
    //let attackers = [] as Array<Square>

    let allTests = true

    triggers.forEach(test => {
        switch (test.kind) {
            case 'adjacent attacked squares':
                color = whichColor(game, test.player)
                opp = opponent( color )
                square = findPiece(game.board(), test.piece, color)
                adjacent = adjacentSquares( square )
                attacked = attackedSquares( game, adjacent, opp )
                
                if ( attacked.length < test.min ) {
                    allTests = false
                    break
                }

            case 'opponent adjacent attacked squares':
                break

            case 'checks':
                color = whichColor(game, test.player)
                opp = opponent( color )
                square = findPiece(game.board(), 'k', opp)

                if ( !game.isAttacked( square )) {
                    allTests = false
                    break
                }
                
        }
    })
    if ( allTests === true ) {
        return true
    } else {
        return false
    }
}