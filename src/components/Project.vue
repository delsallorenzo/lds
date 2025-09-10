<template>
  <section class="project">
    <div class="video-container">
      <video class="video" autoplay loop muted playsinline :src="props.project.media"></video>
      <Button
        id="description-button"
        :textBox="props.project.title"
        :opened="descriptionStatus"
        @click="toggleDescription"
      />
    </div>
    <div class="description-container" :class="{ open: descriptionStatus }" 
         @touchstart="preventTouchPropagation($event)"
         @touchmove="preventTouchPropagation($event)"
         @touchend="preventTouchPropagation($event)">
      <div class="description-text">
        <span class="description">{{ props.project.desc }}</span>
        <Link :text="props.project.linkText" :link="props.project.link" class="link" />
      </div>
      <Button
        textBox="More Info"
        :opened="moreInfoOpen"
        @click="toggleMoreInfo"
        class="more-info-button"
        v-show="props.project.extraInfo"
      />
      <div
        class="gallery"
        :class="{ open: moreInfoOpen }"
        v-if="props.project.extraInfo"
        @wheel="scrollGallery($event)"
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
import { computed, onMounted, ref } from 'vue'
import Button from './Button.vue'
import Link from './Link.vue'

const props = defineProps<{
  project: Project
}>()

const descriptionStatus = computed(() => store.descriptionStatus)
const moreInfoOpen = ref(false)

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

const scrollGallery = (event: WheelEvent) => {
  if (!moreInfoOpen.value) return // Only scroll if gallery is open
  // event.preventDefault()
  const gallery = event.currentTarget as HTMLElement
  gallery.scrollLeft += event.deltaY
}

const preventTouchPropagation = (event: TouchEvent) => {
  // Prevent touch events from bubbling up to parent components
  // This stops the carousel touch handlers from interfering with gallery interactions
  event.stopPropagation()
}

onMounted(() => {
  // Initialize images from project's extraInfo if available
  if (props.project.extraInfo?.pictures) {
    images.value = props.project.extraInfo.pictures.map((picturePath, index) => ({
      src: picturePath,
      alt: `${props.project.title} image ${index + 1}`,
      loaded: false
    }))
  }
})
</script>

<style scoped lang="scss">
$picture-width: 350px;
$picture-height: 350px;

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
    padding: 0 10px;
    background: linear-gradient(to bottom, #f4f4f4, #e5e5e5);
    transition:
      max-height 0.5s ease-in-out,
      padding 0.5s ease-in-out;

    &.open {
      max-height: 60dvh;
      padding: 10px;
      overflow-y: auto;
    }

    .description-text {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      gap: 10px;
      justify-content: space-between;

      .description {
        width: calc(50% - 10px);
      }

      .link {
        width: 50%;
        justify-content: flex-end;
      }

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;

        .description-title {
          font-size: 1.25rem;
        }

        .description-meta {
          font-size: 0.875rem;
        }
      }
    }

    .more-info-button {
      margin-top: 10px;
      padding: 0 !important;
      width: fit-content;
    }

    .gallery {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      max-height: 0;
      transition: max-height 0.5s ease-in-out;
      margin-top: 10px;
      overflow: hidden;
      scrollbar-width: none; // Hide scrollbar in Firefox
      -ms-overflow-style: none; // Hide scrollbar in IE and Edge
      &::-webkit-scrollbar {
        display: none; // Hide scrollbar in WebKit browsers
      }

      &.open {
        max-height: $picture-height; // Adjust this value as needed
        overflow-y: auto;
        overflow-x: auto;
      }

      .gallery-item {
        position: relative;
        width: $picture-width;
        height: $picture-height;
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
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease;
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
        display: grid;
        grid-template-columns: 1fr;
        flex-direction: column;

        &.open {
          max-height: 900px;
          overflow-y: auto;
        }
      }

      .gallery-item {
        position: relative;
        width: 100% !important;
        height: auto;
        aspect-ratio: 1 / 1;
        margin-bottom: 1rem;
        flex-shrink: 0;
        overflow: hidden;

        .image-skeleton,
        .gallery-image {
          position: absolute;
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
          transition: opacity 0.3s ease;
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
  animation: slideInUp 0.3s ease-out 0.3s forwards;
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
