import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.scss'
import { store } from './store.js'

document.addEventListener('selectstart', () => {
  document.documentElement.style.setProperty('--sel-hue', Math.random() * 360)
})

createApp(App).mount('#app')
store.applyTheme()
