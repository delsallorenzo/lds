<template>
  <section class="animation__container" :data-complete="completed" aria-hidden="true">
    <div ref="container" class="animation__wrapper"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web/build/player/lottie_light'
import animationData from '../assets/lds-logo-animation.json'

defineOptions({ name: 'LandingComponent' })
const emit = defineEmits(['animationDone'])
const container = ref(null)
let animation
let startTimer
let endTimer
let safetyTimer
const completed = ref(false)
const complete = () => {
  if (completed.value) return
  completed.value = true
  animation?.goToAndStop(animation.totalFrames - 1, true)
  endTimer = setTimeout(() => emit('animationDone'), 200)
}
onMounted(() => {
  animation = lottie.loadAnimation({ container: container.value, animationData, renderer: 'svg', loop: false, autoplay: false })
  animation.addEventListener('complete', complete)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animation.addEventListener('DOMLoaded', complete)
  } else startTimer = setTimeout(() => animation.play(), 200)
  safetyTimer = setTimeout(complete, 3500)
})
onBeforeUnmount(() => {
  clearTimeout(startTimer)
  clearTimeout(endTimer)
  clearTimeout(safetyTimer)
  animation?.destroy()
})
</script>

<style scoped>
.animation__container { position: fixed; inset: 0; z-index: 998; display: flex; align-items: center; height: 100svh; width: 100svw; background: black; }
.animation__wrapper { width: 100%; height: 100%; margin: auto; max-width: 17%; max-height: 17%; filter: invert(1) blur(5px); }
@media (max-width: 800px) { .animation__wrapper { filter: invert(1) blur(2px); } }
</style>
