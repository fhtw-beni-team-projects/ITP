import { createApp, VueElement } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faChessPawn } from '@fortawesome/free-solid-svg-icons'
import { faChessRook } from '@fortawesome/free-solid-svg-icons'
import { faChessBishop } from '@fortawesome/free-solid-svg-icons'
import { faChessKing } from '@fortawesome/free-solid-svg-icons'
import { faChessKnight } from '@fortawesome/free-solid-svg-icons'
import { faChessQueen } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faChessPawn)
library.add(faChessRook)
library.add(faChessBishop)
library.add(faChessKing)
library.add(faChessKnight)
library.add(faChessQueen)
const app = createApp(App)

app.use(createPinia())
app.use(router)

.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
