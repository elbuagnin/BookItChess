<script setup lang="js">
    import { ref, computed, toValue } from 'vue'
    import jquery from 'jquery'
    import { Chess } from 'chess.js'
    import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.mjs'

    const game = new Chess()

    game.move('e4')
    game.move('e5')
    game.move('f4')
    game.move('exf4')

    let pgn = computed(() => {
        return game.pgn( { newline: '<br />' } )
    })

    let whitesLastMove = computed(() => {
        let history = game.history( { verbose: true } )
        history.reverse()

        for (const move of history) {
            if (move.color == 'w') {
                return move.lan
            }
        }
        
        return ''
    })

    let blacksLastMove = computed(() => {
        let history = game.history( { verbose: true } )
        history.reverse()

        for (const move of history) {
            if (move.color == 'b') {
                return move.lan
            }
        }
        
        return ''
    })
    
    const config = {
        draggable: true,
        showNotation: true,
        position: 'start'
    }

    setTimeout(function() {
        const board = new Chessboard2('myBoard', config);
    }, 0);
    
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                {{ pgn }}
            </v-col>
            <v-col>
                <p class="text-h2">{{ blacksLastMove }}</p>
                <div id="myBoard" style="width: 400px;"></div>
                <p class="text-h2">{{ whitesLastMove }}</p>
            </v-col>
        </v-row>
    </v-container>
    
</template>