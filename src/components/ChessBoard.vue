<template>
    <v-container>
        <v-row no-gutters class="w-100">
            <v-col cols="2" class="bg-blue-grey pl-2 pt-2">
                <p v-for="turn in PGNlist" class="text-left">{{ turn }}</p>
            </v-col>
            <v-col cols="8" class="bg-blue-grey">
                <p class="text-h2">
                    {{ blacksLastMove.piece }}
                    {{ blacksLastMove.from }}
                    <span v-if="blacksLastMove.flags=='c'">x</span>
                    {{ blacksLastMove.to }}           
                </p>
                <div id="gameBoard" style="width: 400px;" class="py-4"></div>
                <p class="text-h2">
                    {{ whitesLastMove.piece }}
                    {{ whitesLastMove.from }}
                    <span v-if="whitesLastMove.flags=='c'">x</span>
                    {{ whitesLastMove.to }}
                </p>
            </v-col>
            <v-col cols="2" class="bg-blue-grey">
                <v-sheet class="position-absolute top-0 my-16">
                    <p v-if="whoseMove=='b'">Black to Move</p>
                </v-sheet>
                <v-sheet class="position-absolute bottom-0 my-16">
                    <p v-if="whoseMove=='w'">White to Move</p>
                </v-sheet>
            </v-col>
        </v-row>
        <v-btn
            id="startBtn"
            @click="setStartPos()"
        >
            Start Position
        </v-btn>
        <label>Status:</label>
        <div id="gameStatus">{{ statusMessage }}</div>
        <label>FEN: {{ FEN }}</label>
        <div id="gameFEN"></div>
        <label>PGN: {{ PGN }}</label>
        <div id="gamePGN"></div>
        <p>{{  }}</p>
    </v-container>
</template>

<script setup lang="js">
    import { ref, computed, toValue } from 'vue'
    import jquery from 'jquery'
    import { Chess } from 'chess.js'
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.mjs'
</script>

<script lang="js">
    const game = new Chess()

    const boardConfig = {
        draggable: true,
        showNotation: true,
        position: 'start',
        onDragStart,
        onDrop
    }

    let board = {}

    setTimeout(function() {
        board = new Chessboard2('gameBoard', boardConfig);
    }, 0);

    let statusMessage = ref('')
    let FEN = ref('')
    let PGN = ref('')
    let PGNlist = ref ([])
    let whoseMove = ref('')
    let whitesLastMove = ref({})
    let blacksLastMove = ref({})

    function PGNtoColumn () {
        let string = game.pgn( { maxWidth: 6, newline: '|' } )        
        return string.split('|')
    }

    
    function getWhitesLastMove () {
        let history = game.history( { verbose: true } )
        history.reverse()

        for (const move of history) {
            if (move.color == 'w') {
                return move
            }
        }
        
        return ''
    }

    function getBlacksLastMove () {
        let history = game.history( { verbose: true } )
        history.reverse()

        for (const move of history) {
            if (move.color == 'b') {
                return move
            }
        }
        
        return ''
    }

    function setStartPos() {
        board.start()
        game.reset()
        updateStatus()
    }

    updateStatus()

    function onDragStart (dragStartEvt) {
        // do not pick up pieces if the game is over
        if (game.isGameOver()) return false

        // only pick up pieces for the side to move
        if (game.turn() === 'w' && !isWhitePiece(dragStartEvt.piece)) return false
        if (game.turn() === 'b' && !isBlackPiece(dragStartEvt.piece)) return false

        // what moves are available to from this square?
        const legalMoves = game.moves({
            square: dragStartEvt.square,
            verbose: true
        })

        // place Circles on the possible target squares
        legalMoves.forEach((move) => {
            board.addCircle(move.to)
        })
    }

    function isWhitePiece (piece) { return /^w/.test(piece) }
    function isBlackPiece (piece) { return /^b/.test(piece) }

    function onDrop (dropEvt) {
        // see if the move is legal
        const move = game.move({
            from: dropEvt.source,
            to: dropEvt.target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // remove all Circles from the board
        board.clearCircles()

        // make the move if it is legal
        if (move) {
            // update the board position with the new game position, then update status DOM elements
            board.fen(game.fen(), () => {
            updateStatus()
            })
        } else {
            return 'snapback'
        }
    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    // function onSnapEnd () {
    //   board.position(game.fen())
    // }

    // update DOM elements with the current game status
    function updateStatus () {
        const whoseMoveName = game.turn() === 'w' ? 'White' : 'Black'
        whoseMove.value = whoseMoveName[0].valueOf().toLowerCase()
        whitesLastMove.value = getWhitesLastMove()
        blacksLastMove.value = getBlacksLastMove()
        FEN.value = game.fen()
        PGN.value = game.pgn()
        PGNlist.value = PGNtoColumn()
        
        if (!game.isGameOver()) {
            if (game.inCheck()) statusMessage.value = whoseMoveName + ' is in check! '
        } else if (game.isCheckmate() && game.turn() === 'w') {
            statusMessage.value = 'Game over: white is in checkmate. Black wins!'
        } else if (game.isCheckmate() && game.turn() === 'b') {
            statusMessage.value = 'Game over: black is in checkmate. White wins!'
        } else if (game.isStalemate() && game.turn() === 'w') {
            statusMessage.value = 'Game is drawn. White is stalemated.'
        } else if (game.isStalemate() && game.turn() === 'b') {
            statusMessage.value = 'Game is drawn. Black is stalemated.'
        } else if (game.isThreefoldRepetition()) {
            statusMessage.value = 'Game is drawn by threefold repetition rule.'
        } else if (game.isInsufficientMaterial()) {
            statusMessage.value = 'Game is drawn by insufficient material.'
        } else if (game.in_draw()) {
            statusMessage.value = 'Game is drawn by fifty-move rule.'
        }
    }
</script>