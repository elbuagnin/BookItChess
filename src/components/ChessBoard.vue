<template>
    <v-container>
        <v-row no-gutters class="w-100">
            <v-col cols="2" class="bg-blue-grey pl-2 pt-2">
                <p v-for="turn in pgn" class="text-left">{{ turn }}</p>
            </v-col>
            <v-col cols="8" class="bg-blue-grey">
                <p class="text-h2">
                    {{ blacksLastMove.from }}
                    <span v-if="blacksLastMove.flags=='c'">x</span>
                    {{ blacksLastMove.to }}           
                </p>
                <div id="gameBoard" style="width: 400px;" class="py-4"></div>
                <p class="text-h2">
                    {{ whitesLastMove.from }}
                    <span v-if="whitesLastMove.flags=='c'">x</span>
                    {{ whitesLastMove.to }}
                </p>
            </v-col>
            <v-col cols="2" class="bg-blue-grey">
                <v-sheet class="position-absolute top-0 my-16">
                    <p v-if="whosesMove=='b'">Black's Move</p>
                </v-sheet>
                <v-sheet class="position-absolute bottom-0 my-16">
                    <p v-if="whosesMove=='w'">White's Move</p>
                </v-sheet>
            </v-col>
        </v-row>
        <v-btn
            id="startBtn"
            @click="setStartPos()"
        >
            Start Position
        </v-btn>
    </v-container>
</template>

<script setup lang="js">
    import { ref, computed, toValue } from 'vue'
    import jquery from 'jquery'
    import { Chess } from 'chess.js'
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.mjs'
</script>

<script lang="js">
    const boardConfig = {
        draggable: true,
        showNotation: true,
        position: 'start',
        onDragStart: logDragStart,
    }

    let board = {}

    const game = new Chess()
    setTimeout(function() {
        board = new Chessboard2('gameBoard', boardConfig);
    }, 0);

    game.move('e4')
    game.move('e5')
    game.move('f4')
    game.move('exf4')

    let pgn = computed(() => {
        let string = game.pgn( { maxWidth: 6, newline: '|' } )        
        return string.split('|')
    })

    let whosesMove = computed(() => {
        return game.turn()
    })

    let whitesLastMove = computed(() => {
        let history = game.history( { verbose: true } )
        history.reverse()

        for (const move of history) {
            if (move.color == 'w') {
                return move
            }
        }
        
        return ''
    })

    let blacksLastMove = computed(() => {
        let history = game.history( { verbose: true } )
        history.reverse()

        for (const move of history) {
            if (move.color == 'b') {
                return move
            }
        }
        
        return ''
    })

    function setStartPos() {
        board.start()
    }

    function logDragStart (dragInfo) {
        console.log('Drag started:', dragInfo)
    }

</script>