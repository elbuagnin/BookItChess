<template>
    <v-sheet v-if="!inactivateMenu"
        class="h-100 w-85 ml-1 mr-6 mt-6 bg-transparent"
    >
        <v-container
            class="show"
            :class = "{ hide: hideMenu }"
        >
            King attacked squares: {{ oppKingAttackedSquares }}
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
// Store
    import { ref, computed } from 'vue'
    import { Chess } from 'chess.js'
    import { whereIsPiece, adjSquares } from './helpers';
    import type { Color, Square } from 'chess.js'

    const props = defineProps({
        game: Chess
    })
    const game = props.game
    
    let inactivateMenu = ref(false)
    let hideMenu = ref(false)

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