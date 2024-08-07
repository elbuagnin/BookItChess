<template>
    <v-sheet v-if="!inactivateMenu"
        class="h-100 w-85 ml-1 mr-6 mt-6 bg-transparent"
    >
        <v-container
            class="show"
            :class = "{ hide: hideMenu }"
        >
            <p
                class="pb-4"
            >Select options to start:</p>

            <v-row>
                <v-col>
                    <v-select v-model="playAs"
                        clearable
                        label="Play as ..."
                        :items="['Black', 'White']"
                        variant="outlined"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row
                class="show"
                :class="{ hide: hideFirstPiece }"
            >
                <v-col>
                    <v-select v-if="!hideFirstPiece" v-model="firstPiece"
                        clearable
                        label="First Move"
                        :items="['d4', 'e4', 'others']"
                        variant="outlined"
                    ></v-select>
            </v-col>
            </v-row>
            <v-row
                class="show"
                :class="{ hide: hideOpening }"
            >
                <v-col>
                    <v-select v-if="!hideOpening" v-model="opening"
                        clearable
                        label="Opening for White"
                        :items="['Italian Game', 'Ruy Lopez', 'The Queen\'s Gambit', 'English', 'Catalan', 'Reti']"
                        variant="outlined"
                    ></v-select>
            </v-col>
            </v-row>
            <v-row
                class="show"
                :class="{ hide: hideDefense }"
            >
                <v-col>
                    <v-select v-if="!hideDefense" v-model="defense"
                        clearable
                        label="Defense for Black"
                        :items="['Sicilian', 'King\'s Indian', 'Caro-Kann', 'Benko Gambit', 'Benoni', 'French']"
                        variant="outlined"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row
                class="show"
                :class="{ hide: hideButton }"
            >
                <v-col>
                    <v-btn v-if="!hideButton"
                        @click="inactivate()"
                    >Start</v-btn>
                </v-col>
            </v-row>
            
        </v-container>
    </v-sheet>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    
    let playAs = ref('')
    let firstPiece = ref('')
    let opening = ref('')
    let defense = ref('')
    let inactivateMenu = ref(false)
    let hideMenu = ref(false)

    let hideFirstPiece = computed(() => {
        if ( playAs.value == 'White' || playAs.value == 'Black' ) {
            return false
        } else {
            return true
        }
    })

    let hideOpening = computed(() => {
        if ( firstPiece.value !== '' ) {
            return false
        } else {
            return true
        }
    })

    let hideDefense = computed(() => {
        if ( opening.value !== '' ) {
            return false
        } else {
            return true
        }
    })

    let hideButton = computed(() => {
        if ( defense.value !== '' ) {
            return false
        } else {
            return true
        }
    })

    function inactivate() {
        hideMenu.value = true
        setInterval( () => {
            inactivateMenu.value = true
        }, 1500)
    }
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