<template>
  <section v-if="loaded">
    <Header />
    <Carousel />
  </section>
  <Landing v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Carousel from '@/components/Carousel.vue'
import Header from './components/Header.vue'
import Landing from './components/Landing.vue'
import projectList from '@/assets/projectList.json'

const loaded = ref(false)

onMounted(() => {
  const assetPromises = []
  projectList.projects.forEach(project => {
    if (project.media) {
      assetPromises.push(new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.src = project.media
        video.oncanplaythrough = () => resolve()
        video.onerror = () => {
          console.warn(`Failed to load video: ${project.media}`);
          resolve(); // Resolve even on error to not block the app
        }
      }))
    }
    if (project.extraInfo && project.extraInfo.pictures) {
      project.extraInfo.pictures.forEach(picture => {
        assetPromises.push(new Promise((resolve, reject) => {
          const img = new Image()
          img.src = picture
          img.onload = () => resolve()
          img.onerror = () => {
            console.warn(`Failed to load image: ${picture}`);
            resolve(); // Resolve even on error
          }
        }))
      })
    }
  })

  const loadingPromise = Promise.all(assetPromises)
  const timerPromise = new Promise(resolve => setTimeout(resolve, 3625))

  Promise.all([loadingPromise, timerPromise]).then(() => {
    loaded.value = true
  }).catch(err => {
      console.error("A critical error occurred during preloading.", err)
      loaded.value = true
  })
})
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
  background: black;
}
@font-face {
  font-family: 'UncutSans';
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  unicode-range: U+000-5FF;
  src:
    url('/fonts/UncutSans/UncutSans-Semibold.woff2') format('woff2'),
    url('/fonts/UncutSans/UncutSans-Semibold.woff') format('woff');
}

#app {
  font: 600 15px 'UncutSans', Arial, sans-serif;
  letter-spacing: -0.25px;
  line-height: 15px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-feature-settings: "ss02" on, "ss05" on, "ss06" on, "ss08" on;
}

.curtain {
  position: fixed;
  height: 100svh;
  width: 100svw;
  background: rgb(245, 245, 245);
  transform: translateY(-100%);
  z-index: 999;

  &.dropFromTop {
    animation-name: drop-down-from-top;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1);
  }
  &.dropToBottom {
    animation-name: drop-down-to-bottom;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1);
  }
  @keyframes drop-down-from-top {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes drop-down-to-bottom {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
}
</style>