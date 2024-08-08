import { createApp } from 'vue'
//import './style.css'
import '../node_modules/@chrisoakman/chessboard2/dist/chessboard2.min.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
    components,
    directives,
})

// Pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

import App from './App.vue'

createApp(App).use(vuetify).use(pinia).mount('#app')
