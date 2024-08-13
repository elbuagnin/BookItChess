import type { Chess } from 'chess.js'

export const ActivityUserMove = class {
    game = {} as Chess
    constructor(game: Chess) {
        this.game = game
    }
}