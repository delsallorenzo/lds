<template>
  <VideoPlayer v-for="index in nearbyIndices" :key="projects[index].slug" :project="projects[index]" :active="index === store.activeSlideIndex" @ready="onVideoReady(index)" @failed="onVideoReady(index)" />
  <main :inert="!revealed">
    <Header />
    <Carousel />
  </main>
  <Landing v-if="showIntro" @animationDone="phase = 'cover'" />
  <div v-if="phase !== 'done'" class="curtain" :class="phase" @animationend="onCurtainEnd"></div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { store } from './store.js'
import Carousel from './components/Carousel.vue'
import Header from './components/Header.vue'
import Landing from './components/Landing.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import projectList from './assets/projectList.json'

const projects = projectList.projects
const nearbyIndices = computed(() => [...new Set([0, -1, 1].map(offset => (store.activeSlideIndex + offset + projects.length) % projects.length))])
const phase = ref('intro')
const showIntro = ref(true)
const covered = ref(false)
const videoReady = ref(false)
const revealed = ref(false)
let fallbackTimer
const reveal = () => {
  if (covered.value && videoReady.value && phase.value === 'cover') {
    revealed.value = true
    phase.value = 'reveal'
  }
}
const onVideoReady = index => {
  if (index !== store.activeSlideIndex) return
  videoReady.value = true
  reveal()
}
const onCurtainEnd = event => {
  if (event.target !== event.currentTarget) return
  if (phase.value === 'cover') {
    covered.value = true
    showIntro.value = false
    reveal()
  } else if (phase.value === 'reveal') phase.value = 'done'
}
onMounted(() => {
  // A slow or unavailable video must never keep the portfolio behind the intro.
  fallbackTimer = setTimeout(() => { videoReady.value = true; reveal() }, 5000)
})
onBeforeUnmount(() => clearTimeout(fallbackTimer))
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
  background: black;
}
#app {
  font: 600 13px 'UncutSans', Arial, sans-serif;
  letter-spacing: -0.25px;
  line-height: 1.1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-feature-settings: "ss02" on, "ss05" on, "ss06" on, "ss08" on;
}

/* One curtain covers both halves of the intro. */
.curtain { position: fixed; inset: 0; background: rgb(245, 245, 245); transform: translateY(-100%); z-index: 999; pointer-events: none; }
.curtain.cover { animation: curtain-cover .5s var(--ease) both; }
.curtain.reveal { animation: curtain-reveal .5s var(--ease) both; }
@keyframes curtain-cover { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes curtain-reveal { from { transform: translateY(0); } to { transform: translateY(100%); } }
@media (prefers-reduced-motion: reduce) { .curtain.cover, .curtain.reveal { animation-duration: 1ms; } }
</style>
