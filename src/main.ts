import { createApp } from 'vue'
//import './style.css'
import '../node_modules/@chrisoakman/chessboard2/dist/chessboard2.min.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App).use(vuetify).mount('#app')
