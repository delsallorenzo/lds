<template>
  <section class="project">
    <div class="video-container">
      <video ref="videoRef" class="video" autoplay loop muted playsinline :src="props.project.media"></video>
      <Button
        id="description-button"
        :textBox="props.project.title"
        :opened="descriptionStatus"
        @click="toggleDescription"
      />
    </div>
    <div ref="descriptionContainer" class="description-container" :class="{ open: descriptionStatus }" 
         @touchstart="preventTouchPropagation($event)"
         @touchmove="preventTouchPropagation($event)"
         @touchend="preventTouchPropagation($event)">
      <div class="description-text">
        <span class="description">{{ props.project.desc }}</span>
        <Link :text="props.project.linkText" :link="props.project.link" class="link" />
      </div>
      <Button
        textBox="More"
        :opened="moreInfoOpen"
        @click="toggleMoreInfo"
        class="more-info-button"
        v-show="props.project.extraInfo"
      />
      <div
        ref="galleryContainer"
        class="gallery"
        :class="{ open: moreInfoOpen }"
        v-if="props.project.extraInfo"
        @touchstart="preventTouchPropagation($event)"
        @touchmove="preventTouchPropagation($event)"
        @touchend="preventTouchPropagation($event)"
      >
        <div class="gallery-item" v-for="(image, index) in images" :key="index">
          <div v-if="!image.loaded" class="image-skeleton"></div>
          <img
            class="gallery-image"
            :class="{ loaded: image.loaded }"
            :src="image.src"
            :alt="image.alt"
            @load="onImageLoad(index)"
            @error="onImageError(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Project } from '@/models/project.model'
import { store } from '@/store.js'
import { computed, onMounted, ref, watch, onUnmounted } from 'vue'
import Button from './Button.vue'
import Link from './Link.vue'
import Lenis from 'lenis'

const props = defineProps<{
  project: Project
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const descriptionContainer = ref<HTMLElement | null>(null)
const galleryContainer = ref<HTMLElement | null>(null)

const descriptionStatus = computed(() => store.descriptionStatus)
const moreInfoOpen = ref(false)

let descriptionLenis: Lenis | null = null
let galleryLenis: Lenis | null = null
let rafHandle: number;

function raf(time: number) {
  descriptionLenis?.raf(time)
  galleryLenis?.raf(time)
  rafHandle = requestAnimationFrame(raf)
}

watch(descriptionStatus, (newValue) => {
  if (newValue && descriptionContainer.value && !descriptionLenis) {
    descriptionLenis = new Lenis({
      wrapper: descriptionContainer.value,
    })
  } else if (!newValue && descriptionLenis) {
    setTimeout(() => {
      descriptionLenis?.destroy()
      descriptionLenis = null
    }, 800) // Wait for the closing animation to finish
  }
})

watch(moreInfoOpen, (newValue) => {
  if (newValue && galleryContainer.value && !galleryLenis) {
    galleryLenis = new Lenis({
      wrapper: galleryContainer.value,
      orientation: 'horizontal',
    })
  } else if (!newValue && galleryLenis) {
    setTimeout(() => {
      galleryLenis?.destroy()
      galleryLenis = null
    }, 800) // Wait for the closing animation to finish
  }
})

const toggleDescription = () => {
  store.toggleDescription()
}

interface ImageItem {
  src: string
  alt: string
  loaded: boolean
}

const images = ref<ImageItem[]>([])

const toggleMoreInfo = () => {
  moreInfoOpen.value = !moreInfoOpen.value
}

const onImageLoad = (index: number) => {
  images.value[index].loaded = true
}

const onImageError = (index: number) => {
  images.value[index].loaded = true // Hide skeleton even on error
}

const preventTouchPropagation = (event: TouchEvent) => {
  // Prevent touch events from bubbling up to parent components
  // This stops the carousel touch handlers from interfering with gallery interactions
  event.stopPropagation()
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.playbackRate = 1.0
  }
  // Initialize images from project's extraInfo if available
  if (props.project.extraInfo?.pictures) {
    images.value = props.project.extraInfo.pictures.map((picturePath, index) => ({
      src: picturePath,
      alt: `${props.project.title} image ${index + 1}`,
      loaded: false
    }))
  }
  rafHandle = requestAnimationFrame(raf)
})

onUnmounted(() => {
  descriptionLenis?.destroy()
  galleryLenis?.destroy()
  cancelAnimationFrame(rafHandle)
})
</script>

<style scoped lang="scss">
$picture-width: 700px;
$picture-height: 700px;

$desktop-width: 500px;
$desktop-height: 500px;

$mobile-width: 300px;
$mobile-height: 300px;

.project {
  display: flex;
  flex-flow: column nowrap;
  height: 100dvh;

  .video-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    video {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .description-container {
    height: auto;
    max-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background: linear-gradient(to bottom, #f4f4f4, #e5e5e5);
    transition:
      max-height 0.75s cubic-bezier(0.15, 0.85, 0.25, 0.95),
      padding 0.75s cubic-bezier(0.15, 0.85, 0.25, 0.95);

    &.open {
      max-height: 80dvh;
      overflow-y: auto;
      gap: 10px;
    }

    .description-text {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      padding: 10px;
      gap: 10px;
      justify-content: space-between;

      .description {
        width: calc(75% - 10px);
      }

      .link {
        width: 25%;
        justify-content: flex-end;
      }

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;

        .description {
        width: 100%;
      }

        .description-title {
          font-size: 1.25rem;
        }

        .description-meta {
          font-size: 0.875rem;
        }

        .link {
        width: fit-content;
        justify-content: flex-start;
      }
      }
    }

    .more-info-button {
      margin: 0px 10px 0px 10px;
      width: fit-content;
      padding: 0;

      &.open {
        margin-bottom: 10px;
      }
    }

    .gallery {
      display: flex;
      flex-direction: row;
      margin: 0px 10px 0px 10px;
      gap: 10px;
      max-height: 0;
      overflow: hidden;
      scrollbar-width: none; // Hide scrollbar in Firefox
      -ms-overflow-style: none; // Hide scrollbar in IE and Edge
      transition: max-height 0.8s cubic-bezier(0.1, 0.9, 0.2, 1);
      &::-webkit-scrollbar {
        display: none; // Hide scrollbar in WebKit browsers
      }

      &.open {
        max-height: $picture-height;
        overflow-y: hidden;
        overflow-x: auto;
        padding-bottom: 10px;
      }

      .gallery-item {
        position: relative;
        height: 100%;
        flex-shrink: 0;
        overflow: hidden;

        .image-skeleton {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 8px;
          z-index: 1;
        }

        .gallery-image {
          position: relative;
          top: 0;
          left: 0;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
          z-index: 2;

          &.loaded {
            opacity: 1;
          }
        }
      }
    }

    @keyframes skeleton-loading {
      0% {
        background-position: -200% 0;
      }

      100% {
        background-position: 200% 0;
      }
    }

    // Mobile responsive styles
    @media (max-width: 768px) {
      &.open {
        max-height: 80dvh;
      }

      .gallery {
        display: flex;
        grid-template-columns: 1fr;
        flex-direction: column;

        &.open {
          max-height: 100%;
          overflow-y: auto;
        }
      }

      .gallery-item {
        position: relative;
        height: 100%;
        padding-top: 0px;
        padding-bottom: 0px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
        overflow: hidden;

        .image-skeleton,
        .gallery-image {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 8px;
          z-index: 1;
        }

        .gallery-image {
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
          z-index: 2;

          &.loaded {
            opacity: 1;
          }
        }
      }
    }
  }
}

#description-button {
  position: absolute;
  transform: translateY(30px);
  animation: slideInUp 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) 0.3s forwards;
}

@keyframes slideInUp {
  from {
    transform: translateY(30px);
  }
  to {
    transform: translateY(0);
  }
}
</style>