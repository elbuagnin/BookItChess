import { Chess } from 'chess.js'
import { Chessboard2 } from '../../node_modules/@chrisoakman/chessboard2/dist/chessboard2.min.mjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const chessGame = defineStore('chessGame', () => {
    const game = ref(new Chess())
    const board = ref({} as Chessboard2)
    
    return { game, board }
})