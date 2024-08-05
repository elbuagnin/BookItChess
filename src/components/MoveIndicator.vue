<script setup lang="ts">
import { computed } from 'vue';
import { Color } from '../chess'

    const props = defineProps({
        color: String,
        check: String,
        whoseMove: String,
        to: String,
        from: String,
        piece: String,
        flags: String
    })

    function opponentColor(color: Color): Color {
        return color === 'w' ? 'b' : 'w'
    }

    let castle = computed(() => {
        if ( props.flags === 'k' || props.flags === 'q' ) {
            return true
        } else {
            return false
        }
    })
</script>

<template>
        <span v-if="castle == false">{{ props.piece }}&nbsp;</span>
        <span v-if="castle == false">{{ props.from }}&nbsp;</span>
        <span v-if="flags=='c'">x</span>
        <span v-if="castle == false">{{ props.to }}&nbsp;</span>
        <span v-if="props.check == opponentColor(props.color as Color)">+</span>
        <span v-if="flags == 'k'">O-O</span>
        <span v-if="flags == 'q'">O-O-O</span>
        <span v-if="props.whoseMove==props.color">...</span>
                   
</template>