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
                    <MoveIndicator v-if="blacksLastMove" v-bind="{ color: 'b', whoseMove: whoseMove, check: check, to: blacksLastMove.to, from: blacksLastMove.from, piece: blacksLastMove.piece, flags: blacksLastMove.flags}"/>
                    <span v-else>&nbsp;</span>
                </p>
                <v-sheet
                    id="gameBoard"
                    style="width: 400px; z-index: 0; position: static;"
                    class="mx-auto py-4 bg-transparent"
                >
                </v-sheet>

                <p class="pb-4 text-center text-h3">
                    <MoveIndicator v-if="whitesLastMove" v-bind="{ color: 'w', whoseMove: whoseMove, check: check, to: whitesLastMove.to, from: whitesLastMove.from, piece: whitesLastMove.piece, flags: whitesLastMove.flags}"/>    
                </p>
            </v-col>
            <v-col cols="3" class="bg-blue-grey">
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
                    <InGamePanel v-bind="{oppKingAttackedSquares: oppKingAttackedSquares}" />
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

<script setup lang="ts">
    // Type
    import type { Square, Color, Move } from 'chess.js'
    import { FEN_T } from '../chess'

    // Store
    import { createPinia } from 'pinia'
    import { chessGame } from '../stores/gameStore'

    // Core modules
    import { ref, computed } from 'vue'

    // Chess modules
    // import { Chess } from 'chess.js'
    import { Chessboard2 } from '../../node_modules/@chrisoakman/chessboard2/dist/chessboard2.min.mjs'

    // // Composables
    import { isBlackPiece, isWhitePiece, lastMove, whereIsPiece, adjSquares } from './helpers'

    // Components
    import MoveIndicator from './MoveIndicator.vue'
    import NewGameMenu from './NewGameMenu.vue'
    import InGamePanel from './InGamePanel.vue'
    
</script>

<script lang="ts">
    // Initialize game store and chessboard modules
    const pinia = createPinia()
    const gameState = chessGame(pinia)
    const game = gameState.game

    const boardConfig = {
        draggable: true,
        showNotation: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd
    }

    let board = {} as Chessboard2

    setTimeout(function() {
        board = new Chessboard2('gameBoard', boardConfig);
    }, 0);

    // reactive variables
    let statusMessage = ref('')
    let FEN = ref('' as FEN_T)
    let PGN = ref('')
    let PGNlist = ref ([] as Array<String> )
    let whoseMove = ref('' as Color)
    let check = ref('')
    let history = ref([] as Array<Move>)
    let blacksLastMove = ref({} as Move)
    let whitesLastMove = ref({} as Move)

    // Analysis Functions
    let turn = computed((): Color | undefined => {
        return game?.turn()
    })

    let opponent = computed((): Color | undefined => {
        return turn.value==='w' ? 'b' : 'w'
    })

    let oppKingPos = computed((): Square | undefined => {
        return whereIsPiece( game?.board(), 'k', opponent.value)
    })

    let oppKingAdjOpenSquares = computed(() => {
        const openSquares = [] as Array<Square>
        adjSquares(oppKingPos.value)?.forEach( sq => {
            if ( !game?.get(sq) ) {
                openSquares.push(sq)
            }
        })
        return openSquares
    })

    let oppKingAttackedSquares = computed(() => {
        const attackedSquares = [] as Array<object>
        oppKingAdjOpenSquares.value.forEach(sq => {
            if ( game?.isAttacked(sq, turn.value) ) {
                attackedSquares.push(sq)
            }
        })
        return attackedSquares
    })

    // Start the game
    updateStatus()

    // User action functions
    function setStartPos() {
        board.start()
        game.reset()
        updateStatus()
    }

    // Chess Game Play Event functions
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
    function onSnapEnd () {
      board.position(game.fen())
    }

    // update DOM elements with the current game status
    function updateStatus () {
        // Update reactive variables
        history.value = game.history({ verbose: true })
        const whoseMoveName = game.turn() === 'w' ? 'White' : 'Black'
        whoseMove.value = game.turn() === 'w' ? 'w' : 'b'
        if ( whoseMove.value == 'b' ) {
            whitesLastMove.value = lastMove(history.value)
        }
        if ( whoseMove.value == 'w') {
            blacksLastMove.value = lastMove(history.value)
        }
        FEN.value = game.fen() as FEN_T
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
        } else if (game.isDraw()) {
            statusMessage.value = 'Game is drawn by fifty-move rule.'
        }
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