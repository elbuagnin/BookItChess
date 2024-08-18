<template>
    <v-container>
        <v-row no-gutters>
            <v-col cols="3" class="pl-4 pt-4 bg-blue-grey">
                <pgnTurnList :PGNlist="PGNlist"/>
                
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
        <v-row
            no-gutters
            class="border-t-sm"
        >
            <v-col
                class="mx-auto"
            >
                <v-sheet
                    class="px-8 pt-4 bg-blue-grey-darken-3"
                    style="display: flex; min-height: 4rem;"
                >
                    <span
                        class="pt-2 mr-4"
                    >
                        {{ activityText }}
                    </span>
                    <span v-if="askActivityCount">
                        <v-select
                        width="6rem"
                        lines="one"
                        density="compact"
                        
                        :items="answerCounts"
                        item-title="title"
                        item-value="value"
                        @update:model-value="sendAnswer"
                        ></v-select>
                    </span>
                </v-sheet>
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
    import type { Square, Color, Move, PieceSymbol } from 'chess.js'
    import type { FEN_T } from '../chess'
    import type { Activity } from '../main'

    // Store
    import { createPinia } from 'pinia'
    import { chessGame } from '../stores/gameStore'

    // Core modules
    import { ref, computed } from 'vue'

    // Chess modules
    // import { Chess } from 'chess.js'
    import { Chessboard2 } from '../../node_modules/@chrisoakman/chessboard2/dist/chessboard2.min.mjs'

    // // Composables
    import { isBlackPiece, isWhitePiece, lastMove, findPiece, adjacentSquares } from './helpers'
    import { activityPlans } from './trainer'
    import { ActivityCount, ActivityUserMove, ActivityMarkSquares } from './activities'
    import triggered from './triggered.ts'
    //import patternMatcher from './patternMatcher.ts'

    // Components
    import pgnTurnList from './pgnTurnList.vue'
    import MoveIndicator from './MoveIndicator.vue'
    import NewGameMenu from './NewGameMenu.vue'
    import InGamePanel from './InGamePanel.vue'    
</script>

<script lang="ts">
    // Initialize game store and chessboard modules
    const pinia = createPinia()
    const gameState = chessGame(pinia)
    const game = gameState.game
    let board = gameState.board

    const boardConfig = {
        draggable: true,
        showNotation: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        onMousedownSquare: logMousedownSquare,

    }

    

    // let board = {} as Chessboard2

    setTimeout(function() {
        board = new Chessboard2('gameBoard', boardConfig)
        //board = new Chessboard2('gameBoard', boardConfig);
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

    // programatic variables
    let activity = {} as Activity | undefined
    let currentActivityAction = ''
    let lastActivity = {} as Activity | undefined
    let activityText = ref('')
    let askActivityCount = false
    const answerCounts = [
        { title: '', value: null},
        { title: '0', value: 0},
        { title: '1', value: 1},
        { title: '2', value: 2},
        { title: '3', value: 3},
        { title: '4', value: 4},
        { title: '5', value: 5}
    ]

    // Player Aux Interface
    function addCircle (square: Square, color='grey', opacity='1', size='1') {
        board.addCircle({square: square, color: color, opacity: opacity, size: size})
    }

    function clearMarks () {
        board.clearCircles()
    }

    function logMousedownSquare (evt, domEvt) {
        console.log('event logMouse activated')
        console.log(currentActivityAction)
        if ( currentActivityAction === 'mark' ) {  
            console.log('yes it is')          
            const { square } = evt
            console.log('event square is ', square)
            console.log(activity)
            activity.square = square
            activityText.value = activity.message   
            if (activity.result === true) {
                addCircle(square, 'green', '0.5', 'large')
            }
        }
    }

    function sendAnswer (event) {
        if (currentActivityAction === 'count') {
                if (Number.isInteger(event)) {
                console.log(event)
                activity.answer = event
                activityText.value = activity.message
            }
        }
    }
    
    
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

        // run a lesson if needed
        if ( activity ) {
            lastActivity = currentActivityAction
        }
        console.log(currentActivityAction)
        console.log('plans', activityPlans)
        activityPlans.forEach((activityPlan) => {
            console.log('plan', activityPlan.action)
            const triggers = activityPlan.triggered.tests
            console.log('triggers', triggers)
            if ( triggered( game, triggers )) {
                console.log('triggered')
                currentActivityAction = activityPlan.action
                const { action, script } = activityPlan
                console.log('action', action)
                    switch ( action ) {
                    case 'mark':
                        if (lastActivity !== '') {
                            console.log('new mark activity')
                            activity = new ActivityMarkSquares( game, script )
                            activityText.value = activity.message
                        }
                        break
                    case 'count':
                        activity = new ActivityCount ( game, script )
                        activityText.value = activity.message
                        askActivityCount = true
                        break
                    default:
                        activity = { active: false }
                        // play move
                }
            } else if (game.moveNumber() > triggers.beforeTurn) {
                //activity.end()
            } else {
                //currentActivityAction = 'move'
                activity = new ActivityUserMove( game )
            }
        })      
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