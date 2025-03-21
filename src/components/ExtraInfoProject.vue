<template>
  <div class="more-info-container" @mousedown.stop @touchstart.stop>
    <Button :textBox="'More'" :opened="isOpen" @click="toggleProjectInfo" />
    <div
      class="more-info-content"
      :class="{ 'content-open': isOpen }"
      ref="contentRef"
      @mousedown.stop="handleDragStart"
      @touchstart.stop="handleDragStart"
    >
      <div class="more-info-element" v-for="item in prop.more" :key="item.text">
        <div class="media-container">
          <img v-if="item.media" :src="item.media" alt="Project media" class="media-image" />
        </div>
        <span class="description">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { store } from '@/store.js'

const prop = defineProps<{
  more?: { text: string; media: string }[];
  projectId: string | number; // Add a required projectId prop
}>()

// Check if this specific project is open
const isOpen = computed(() => store.isMoreInfoOpen(prop.projectId))
const contentRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
let startX = 0
let scrollLeft = 0

// Toggle info for this specific project
const toggleProjectInfo = () => {
  store.toggleMoreInfo(prop.projectId);
}

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  e.stopPropagation()

  if (!contentRef.value) return

  isDragging.value = true
  contentRef.value.classList.add('dragging')

  // Get initial position
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  startX = clientX
  scrollLeft = contentRef.value.scrollLeft

  // Prevent default behavior
  e.preventDefault()
}

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !contentRef.value) return

  // Stop propagation to prevent parent elements from handling
  e.stopPropagation()

  // Calculate new scroll position
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const dx = clientX - startX
  contentRef.value.scrollLeft = scrollLeft - dx

  // Prevent default scrolling behavior
  e.preventDefault()
}

const handleDragEnd = (e: MouseEvent | TouchEvent) => {
  if (e) e.stopPropagation()
  isDragging.value = false
  if (contentRef.value) contentRef.value.classList.remove('dragging')
}

onMounted(() => {
  document.addEventListener('mousemove', handleDragMove, { passive: false })
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove, { passive: false })
  document.addEventListener('touchend', handleDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
})
</script>

<style scoped lang="scss">
.more-info-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5rem 0;
  width: 100%;

  & .more-info-content {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    margin: 0 0.5rem;
    width: 100%;

    &.content-open {
      max-height: 1000px;
      transition: max-height 0.5s ease-in;
      overflow-x: auto;
      flex-wrap: nowrap;
      scrollbar-width: none;
      cursor: grab;
    }

    &.dragging {
      cursor: grabbing;
      user-select: none;
    }

    .more-info-element {
      flex: 0 0 auto;
      margin-right: 1.5rem;
      width: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;

      &:last-child {
        margin-right: 0;
      }

      .media-container {
        width: 150px;
        height: 150px;
        overflow: hidden;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;

        .media-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .description {
        text-align: left;
        font-size: 0.9rem;
        width: 100%;
        word-wrap: break-word;
      }
    }

    .info-box {
      width: 200px;
      min-height: 200px;
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 55%, #fad0c4 100%);
    }
  }
}
</style>
