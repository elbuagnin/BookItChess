<script setup lang="ts">
    defineProps({
        PGNlist: Array<String>
    })

    let firstBreak = 0
    let secondBreak = 0

    function number(turn: String) {
        firstBreak = turn.indexOf('.') + 2
        return turn.substring(0, firstBreak)
    }

    function white(turn: String) {
        if (!blacksTurn(turn)) {
            secondBreak = turn.length
            return turn.substring(firstBreak, turn.length)
        } else {
            return turn.substring(firstBreak, secondBreak)
        }
    }

    function black(turn: String) {
        return turn.substring(secondBreak, turn.length)
    }

    function blacksTurn(turn: String) {
        let count = 0
        for (let i = 0; i < turn.length; i++) {
            if (turn[i] === ' ') {
                count++
            }
        }
        return count===2 ? true : false
    }
</script>

<template>
    <v-row v-for="turn in PGNlist"
        no-gutters
    >
        <v-col cols="4">
            {{ number(turn) }}
        </v-col>
        <v-col cols="3">
            {{ white(turn) }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
            <span v-if="blacksTurn(turn)">
                {{ black(turn) }}
            </span>
        </v-col>
        <v-col cols="2">

        </v-col>
    </v-row>
</template>