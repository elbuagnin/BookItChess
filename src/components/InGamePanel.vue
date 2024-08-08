<template>
    <v-sheet v-if="!inactivateMenu"
        class="h-100 w-85 ml-1 mr-6 mt-6 bg-red"
    >
        <v-container
            class="show"
            :class = "{ hide: hideMenu }"
        >
            King is {{ oppKingPos }}
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { whereIsPiece } from './helpers';
    import { Chess } from 'chess.js';

    const props = defineProps({
        gameState: Chess
    })

    let { gameState } = props
    
    let inactivateMenu = ref(false)
    let hideMenu = ref(false)

    let oppKingPos = computed(() => {
        if ( gameState ) {
            //console.log(gameState)
            //let board = gameState.board()
            
            //return whereIsPiece(board, 'k', 'b')
        } else {
            return undefined
        }
    })
</script>

<style>
    .show {
        opacity: 1;
        transition: all .7s ease-in;
    }

    .hide {
        opacity: 0;
        transition: opacity 1.5s linear;
    }
</style>