<template>
  <section v-if="loaded">
    <Header />
    <Carousel />
  </section>
  <Landing v-else @animationDone="loaded = true" />
</template>

<script setup lang="ts">
import Carousel from '@/components/Carousel.vue'
import Header from './components/Header.vue'
import Landing from './components/Landing.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { store } from './store'
import { onMounted, onUnmounted, ref } from 'vue'

const loaded = ref(false)

function handleKeyDown(event) {
  if (event.code === 'Space' || event.keyCode === 32) {
    console.log('Spacebar pressed')
    store.toggleDescription()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  store.initTheme() // Initialize theme on mount
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss">
@import '@/assets/main.scss';
</style>
