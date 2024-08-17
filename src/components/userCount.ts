import { Chess, Color, PieceSymbol } from "chess.js"
import { opponent } from "./helpers"
import findChecks from "./findChecks"

interface Params {
    kind: string,
    player: 'user' | '',
    piece: PieceSymbol
}

interface Communication {
    start: string,
    hint: string,
    correct: string,
    attacked: string,
    invalid: string,
    end: string,
    continue: string
}

export const ActivityCount = class {
    game = {} as Chess
    trial = {} as Chess

    kind = ''
    player = '' as Color
    piece = '' as PieceSymbol

    activeState = true
    completion = 'incomplete'
    communication = {} as Communication
    sendMessage = ''
    sendResult = false

    count = 0

    constructor(game: Chess, script: {messages: Communication, params: Params}) {
        this.game = game
        this.trial = game

        const { messages: messages, params: params } = script

        this.kind = params.kind
        this.player = params.player==='user' ? game.turn() : opponent(game.turn())
        this.piece = params.piece

        this.communication = messages as Communication
  
        this.sendMessage = this.communication.start

        switch (this.kind) {
            case 'check moves':
                this.count = findChecks(game).length
        }
    }

    set answer(userCount: number) {
        if ( userCount === this.count ) {
            this.completion = 'complete'
            this.sendResult = true
            this.sendMessage = this.communication.end
            this.end()
        } else {
            this.sendMessage = this.communication.hint
            this.sendResult = false
        }
    }

    get active() {
        return this.activeState
    }

    get status() {
        return this.completion
    }

    get message() {
        return this.sendMessage
    }

    get result() {
        return this.sendResult
    }

    end() {
        this.sendMessage = this.communication.end
        this.activeState = false
    }
}