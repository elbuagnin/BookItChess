<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="3" class="pl-4 pt-4 bg-blue-grey">
                <p v-for="turn in PGNlist"
                class="text-left"
                style="overflow: scroll;"    
            >{{ turn }}</p>
            </v-col>
            <v-col cols="6" class="bg-blue-grey">
                <p class="pt-4 text-center text-h3">
                    <MoveIndicator v-bind="{ color: 'b', whoseMove: whoseMove, check: check, to: blacksLastMove.to, from: blacksLastMove.from, piece: blacksLastMove.piece, flags: blacksLastMove.flags}"/>
                </p>

                <v-sheet
                    id="gameBoard"
                    style="width: 400px;"
                    class="mx-auto py-4 bg-transparent"
                ></v-sheet>

                <p class="pb-4 text-center text-h3">
                    <MoveIndicator v-bind="{ color: 'w', whoseMove: whoseMove, check: check, to: whitesLastMove.to, from: whitesLastMove.from, piece: whitesLastMove.piece, flags: whitesLastMove.flags}"/>    
                </p>
            </v-col>
            <v-col cols="3" class="bg-blue-grey">
                taco is {{ blacksLastMove }}
                <div 
                    class="fill-height show position-absolute"  
                    :class="{ hide: PGN!==''}"
                >
                    <NewGameMenu />
                </div>

                <div 
                    class="fill-height show position-absolute"  
                    :class="{ hide: PGN===''}"
                >
                    <InGamePanel v-bind="{ gameState: gameState }"/>
                </div>
            
            </v-col>
        </v-row>
        <v-btn
            id="startBtn"
            @click="setStartPos()"
        >
            Reset
        </v-btn>
        <div id="gameStatus">{{ statusMessage }}</div>
        <!-- <label>FEN: {{ FEN }}</label>
        <div id="gameFEN"></div>
        <label>PGN: {{ PGN }}</label>
        <div id="gamePGN"></div>
        <p>{{  }}</p> -->
    </v-container>
</template>

<script setup lang="js">
    import { ref, computed, toValue } from 'vue'
    import jquery from 'jquery'
    import { Chess } from 'chess.js'
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.mjs'
    import MoveIndicator from './MoveIndicator.vue'
    import { toDisplayCase, lastMove, isBlackPiece, isWhitePiece } from './helpers'
    import NewGameMenu from './NewGameMenu.vue'
    import InGamePanel from './InGamePanel.vue'
    import { reactifyObject } from '@vueuse/core'
</script>

<script lang="js">
    // Initialize game and chessboard modules
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

    // reactive variables
    let gameState = ref({})
    let statusMessage = ref('')
    let FEN = ref('')
    let PGN = ref('')
    let PGNlist = ref ([])
    let whoseMove = ref('')
    let whitesLastMove = ref({})
    let blacksLastMove = ref({})
    let check = ref('')
    let history = ref([])

    // Start the game
    updateStatus()

    // User action functions
    function setStartPos() {
        board.start()
        game.reset()
        updateStatus()
    }

    // Chess Event functions
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
        // Update reactive variables
        history = game.history({ verbose: true })
        const whoseMoveName = game.turn() === 'w' ? 'White' : 'Black'
        whoseMove.value = whoseMoveName[0].valueOf().toLowerCase()
        if ( whoseMove.value == 'b' ) {
            whitesLastMove.value = lastMove('w', history)
        }
        if ( whoseMove.value == 'w') {
            blacksLastMove.value = lastMove('b', history)
        }
        FEN.value = game.fen()
        PGN.value = game.pgn()
        PGNlist.value = game.pgn( { maxWidth: 6, newline: '|' } ).split('|')
        check.value = ''
        
        // Update check & status message
        if (!game.isGameOver()) {
            if (game.inCheck()) {
                statusMessage.value = whoseMoveName + ' is in check!'
                check.value = whoseMove.value
            }
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
        gameState.value = game
    }
</script>

<style>
    .show {
        z-index: 10;
        opacity: 1;
        transition: all 1s ease-in;
    }

    .hide {
        z-index: 0;
        opacity: 0;
        transition: opacity 2s linear;
    }
</style>