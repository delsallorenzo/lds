<template>
  <div id="kinescope-overlay" :style="{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }" style="position:fixed;inset:0;z-index:0;pointer-events:none">
    <iframe v-for="(p, i) in kinescopeProjects" :key="i" :data-media="p.media" :src="p.media" allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;" frameborder="0" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;visibility:hidden;object-fit:cover" :style="{ visibility: activeKinescopeIndex === i ? 'visible' : 'hidden' }"></iframe>
  </div>
  <section v-if="loaded">
    <Header />
    <Carousel />
  </section>
  <Landing v-else @animationDone="onAnimationDone" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { store } from './store.js'
import Carousel from '@/components/Carousel.vue'
import Header from './components/Header.vue'
import Landing from './components/Landing.vue'
import projectList from '@/assets/projectList.json'

const kinescopeProjects = projectList.projects.filter(p => p.media.includes('kinescope.io'))
const activeKinescopeIndex = computed(() => {
  const activeProject = projectList.projects[store.activeSlideIndex]
  if (!activeProject?.media.includes('kinescope.io')) return -1
  return kinescopeProjects.indexOf(activeProject)
})
const loaded = ref(false)
const animationDone = ref(false)
let assetPreloadDone = false

const onAnimationDone = () => {
  animationDone.value = true
  if (assetPreloadDone) loaded.value = true
}

onMounted(() => {
  const assetPromises = []
  projectList.projects.forEach(project => {
    if (project.extraInfo && project.extraInfo.pictures) {
      project.extraInfo.pictures.forEach(picture => {
        assetPromises.push(new Promise((resolve) => {
          const img = new Image()
          img.src = picture
          img.onload = () => resolve()
          img.onerror = () => {
            console.warn(`Failed to load image: ${picture}`);
            resolve()
          }
        }))
      })
    }
  })

  Promise.all(assetPromises).then(() => {
    assetPreloadDone = true
    if (animationDone.value) loaded.value = true
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
  font: 600 13px 'UncutSans', Arial, sans-serif;
  letter-spacing: -0.25px;
  line-height: 1.1;
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
    animation-timing-function: var(--ease);
  }
  &.dropToBottom {
    animation-name: drop-down-to-bottom;
    animation-duration: 0.5s;
    animation-timing-function: var(--ease);
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