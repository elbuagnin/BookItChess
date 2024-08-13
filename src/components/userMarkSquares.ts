import type { Square, Color, PieceSymbol, Chess } from 'chess.js'
import { adjacentSquares, findPiece, opponent, openSquares, attackedSquares, safeSquares } from './helpers'

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

export const ActivityMarkSquares = class {

    game = {} as Chess

    kind = ''
    player = '' as Color
    piece = '' as PieceSymbol

    activeState = true
    completion = 'incomplete'
    communication = {} as Communication
    sendMessage = ''
    sendResult = false

    piecesSquare = '' as Square | undefined
    attackingPlayer = '' as Color
    squaresOfInterest = [] as Array<Square>
    userIdentifiedSquares = [] as Array<Square>

    constructor(game: Chess, script: {messages: Communication, params: Params}) {
        this.game = game
    
        const { messages: messages, params: params } = script

        this.kind = params.kind
        this.player = params.player==='user' ? game.turn() : opponent(game.turn())
        this.piece = params.piece

        this.communication = messages as Communication
  
        this.sendMessage = this.communication.start

        let squaresA = [] as Array<Square> | undefined
        let squaresB = [] as Array<Square> | undefined

        switch (this.kind) {
            case 'safe':
                this.attackingPlayer = opponent(game.turn())
                this.piecesSquare = findPiece(game.board(), this.piece, this.player)
                squaresA = adjacentSquares(this.piecesSquare)
                squaresB = openSquares(game, squaresA)
                this.squaresOfInterest = safeSquares(game, squaresB, this.attackingPlayer)
                break;
            case 'attacked':
                this.attackingPlayer = opponent(game.turn())
                this.piecesSquare = findPiece(game.board(), this.piece, this.player)
                squaresA = adjacentSquares(this.piecesSquare)
                squaresB = openSquares(game, squaresA)
                this.squaresOfInterest = attackedSquares(game, squaresB, this.attackingPlayer)
                break;
            default:
                console.log('ha ha')
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

    set square(x: Square) {
        //this.square = x
        if ( this.squaresOfInterest.find((e) => {
            return e === x
            })
        ) {
            this.userIdentifiedSquares.push(x)
            this.sendResult = true
            this.sendMessage = this.communication.correct
        } else {
            if ( this.game.isAttacked(x, this.attackingPlayer)) {
                this.sendMessage = this.communication.attacked
            } else if ((this.game.moves({square: this.piecesSquare})).indexOf(x)) {
                this.sendMessage = this.communication.invalid
            }
            this.sendResult = false
        }

        if (this.squaresOfInterest.length === this.userIdentifiedSquares.length) {
            this.completion = 'complete'
            this.end()
        } else if (this.userIdentifiedSquares.length > 0 ) {
            this.completion = `$this.userIdentifiedSquares.length` + ' of ' + `$this.squaresOfInterest`
        }
        
    }

    end() {
        this.sendMessage = this.communication.end
        this.activeState = false
    }
}