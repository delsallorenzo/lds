<template>
  <section class="extra-info-container" v-if="project.extraInfo && project.extraInfo.pictures.length > 0">
    <Button @click="toggleMoreInfo" :textBox="opened ? 'Close' : 'More Info'" :opened="opened" />
    <div class="extra-info-content" :class="{ opened: opened }">
      <div class="extra-info-details">
        <div class="extra-info-gallery">
          <picture
            v-for="(picture, index) in project.extraInfo.pictures"
            :key="index"
            class="gallery-picture"
          >
            <img
              :src="picture"
              :alt="`${project.title} - Image ${index + 1}`"
              class="gallery-image"
              loading="lazy"
              decoding="async"
              @load="handleImageLoad"
            />
          </picture>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import { Project } from '@/models/project.model';
import { store } from '@/store.js';
import { computed, defineProps, ref } from 'vue';

defineProps<{
  project: Project
}>()

const opened = ref(false)
const globalOpened = computed(() => store.moreInfoStatus)

const toggleMoreInfo = () => {
  opened.value = !opened.value
  store.toggleMoreInfo()
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.classList.add('loaded')
}
</script>

<style lang="scss" scoped>
.extra-info-container {
  width: 100%;
}

.extra-info-content {
  width: 100%;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: 
    max-height 0.5s cubic-bezier(1, 0, 0, 0.9),
    opacity 0.3s ease 0.1s;

  &.opened {
    max-height: 100%;
    opacity: 1;
  }
}

.extra-info-details {
  padding: 1rem;
  padding-bottom: 2rem;

  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
}

.extra-info-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.gallery-picture {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  opacity: 0;

  &.loaded {
    opacity: 1;
  }

  @media (max-width: 480px) {
    height: 150px;
  }

  &:not(.loaded) {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
