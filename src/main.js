import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.scss'
import { store } from './store.js'

document.addEventListener('selectstart', () => {
  document.documentElement.style.setProperty('--sel-hue', Math.random() * 360)
})

document.documentElement.classList.add('app-running')
createApp(App).mount('#app')
store.applyTheme()
