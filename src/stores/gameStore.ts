import { Chess } from 'chess.js'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('gameStore', () => {
    const game = ref({} as Chess)
    const currentBoard = computed(() => {
        return game.value.board
    })

    return { game, currentBoard }
})