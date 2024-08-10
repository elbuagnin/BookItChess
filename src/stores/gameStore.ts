import { Chess } from 'chess.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const chessGame = defineStore('chessGame', () => {
    
    const game = ref(new Chess())
    
    return { game }
})