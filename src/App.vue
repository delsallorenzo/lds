<template>
  <section v-if="loaded">
    <Header />
    <Scroller>
      <Project v-for="slide in slides" :key="slide.id" :project="slide" />
    </Scroller>
  </section>
  <Landing v-else @animationDone="loaded = true" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import projectList from './assets/projectList.json'
import Header from './components/Header.vue'
import Landing from './components/Landing.vue'
import Project from './components/Project.vue'
import Scroller from './components/Scroller.vue'
import { store } from './store'

let slides = []
const loaded = ref(false)

function handleKeyDown(event) {
  if (event.code === 'Space' || event.keyCode === 32) {
    store.toggleDescription()
  }
}

async function fetchSlides() {
  try {
    slides = projectList.projects
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  store.initTheme()
  fetchSlides()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss">
@import '@/assets/main.scss';
</style>
