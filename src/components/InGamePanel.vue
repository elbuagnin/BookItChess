<template>
    <v-sheet v-if="!inactivateMenu"
        class="h-100 w-85 ml-1 mr-6 mt-6 bg-transparent"
    >
        <v-container
            class="show"
            :class = "{ hide: hideMenu }"
        >
            
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
import { whereIsPiece } from './helpers';

    const props = defineProps({
        game: Object
    })

    let inactivateMenu = ref(false)
    let hideMenu = ref(false)

    let kingPos = computed(() => {
        //
    })

    whereIsPiece(props.game.board(), 'w', 'K')
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