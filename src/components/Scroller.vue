<template>
  <div class="curtain" :class="{ dropToBottom: curtainDrop }"></div>
  <Cursor :label="cursorLabel" :cursorX="cursorX" :cursorY="cursorY" />
  <div class="container" @mousemove="handleMouseMove($event)" @click="handleClick($event)">
    <div
      class="scroller-container"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
    >
      <div class="scroller-track" :style="trackStyle" ref="trackRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Cursor from './Cursor.vue'

const props = defineProps({
  wrapAround: {
    type: Boolean,
    default: true
  }
})

const isDragging = ref(false)
const startX = ref(0)
const currentTranslate = ref(0)
const prevTranslate = ref(0)
const currentIndex = ref(0)
const slideCount = ref(0)
let animationID = null
const isChildDragging = ref(false)
const trackRef = ref(null)
const isTransitioning = ref(false)

// Removed vertical swipe refs (startY, endY)

const cursorLabel = ref('')
const curtainDrop = ref(false)
const cursorX = ref(0)
const cursorY = ref(0)

// Computed
const trackStyle = computed(() => ({
  transform: `translateX(${currentTranslate.value}px)`,
  transition: isDragging.value || isTransitioning.value ? 'none' : 'transform 0.3s ease-out'
}))

// Check if the element or any of its parents has the draggable-child class
const isDraggableChild = (element) => {
  let currentElement = element

  while (currentElement && currentElement !== document.body) {
    if (currentElement.classList.contains('draggable-child')) {
      return true
    }
    currentElement = currentElement.parentElement
  }

  return false
}

// Methods
const getPositionX = (event) => {
  return event.type.includes('mouse') ? event.pageX : event.touches?.[0]?.clientX || 0
}

const startDrag = (event) => {
  // Check if we're clicking on a draggable child element
  if (isDraggableChild(event.target)) {
    isChildDragging.value = true
    return
  }

  isChildDragging.value = false
  isDragging.value = true
  startX.value = getPositionX(event)
  // Removed startY initialization
  cancelAnimation()
}

const onDrag = (event) => {
  if (isChildDragging.value) return

  if (isDragging.value) {
    const currentPosition = getPositionX(event)
    const currentDelta = currentPosition - startX.value
    currentTranslate.value = prevTranslate.value + currentDelta

    // Removed vertical swipe detection code

    // Add resistance at the edges only if wrap is not enabled
    if (!props.wrapAround) {
      if (currentIndex.value === 0 && currentTranslate.value > 0) {
        currentTranslate.value = currentTranslate.value * 0.3
      }

      if (
        currentIndex.value === slideCount.value - 1 &&
        currentTranslate.value < prevTranslate.value
      ) {
        const delta = prevTranslate.value - currentTranslate.value
        currentTranslate.value = prevTranslate.value - delta * 0.3
      }
    }

    event.preventDefault()
    animation()
  }
}

const endDrag = (event) => {
  if (isChildDragging.value) {
    isChildDragging.value = false
    return
  }

  // Removed all vertical swipe detection code

  isDragging.value = false
  const movedBy = currentTranslate.value - prevTranslate.value

  // Threshold to determine if slide should change
  if (Math.abs(movedBy) > window.innerWidth * 0.2) {
    if (movedBy < 0) {
      // Moving forward
      currentIndex.value = currentIndex.value + 1
    } else {
      // Moving backward
      currentIndex.value = currentIndex.value - 1
    }
  }

  setPositionByIndex()
}

const setPositionByIndex = () => {
  if (props.wrapAround) {
    // Handle wrap around
    if (currentIndex.value >= slideCount.value) {
      currentIndex.value = 0
    } else if (currentIndex.value < 0) {
      currentIndex.value = slideCount.value - 1
    }
  } else {
    // Normal behavior (no wrap)
    currentIndex.value = Math.min(Math.max(currentIndex.value, 0), slideCount.value - 1)
  }

  // Calculate the slide offset based on the slide width
  const offset = -(currentIndex.value * window.innerWidth)

  currentTranslate.value = offset
  prevTranslate.value = offset
}

const animation = () => {
  animationID = requestAnimationFrame(animation)
}

const cancelAnimation = () => {
  if (animationID) {
    cancelAnimationFrame(animationID)
  }
}

const handleResize = () => {
  setPositionByIndex()
}

// Lifecycle hooks
onMounted(() => {
  // Count the number of direct child elements (slides)
  setTimeout(() => {
    const track = document.querySelector('.scroller-track')
    if (track) {
      slideCount.value = Array.from(trackRef.value.children).length
      setPositionByIndex()
    }
  }, 0)

  // Add resize listener to adjust slide positions
  window.addEventListener('resize', handleResize)
  curtainDrop.value = true
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimation()
})

function handleClick(event) {
  if (event.target.className == 'video' && window.innerWidth > 900) {
    const clickX = event.clientX
    if (clickX > window.innerWidth / 2) {
      currentIndex.value = currentIndex.value + 1
    } else {
      currentIndex.value = currentIndex.value - 1
    }
    setPositionByIndex()
  }
}

function handleMouseMove(event) {
  cursorX.value = event.clientX
  cursorY.value = event.clientY
  if (event.target.className == 'video') {
    cursorLabel.value = event.clientX > window.innerWidth / 2 ? 'Next' : 'Prev'
  } else {
    cursorLabel.value = ''
  }
}
</script>

<style scoped>
.scroller-container {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  touch-action: none;
  user-select: none;
}

.scroller-track {
  display: flex;
  height: 100%;
  width: 100%;
}

:deep(.scroller-track > *) {
  flex-shrink: 0;
  width: 100vw;
  height: 100vh;
}

:deep(.draggable-child) {
  touch-action: auto;
  cursor: move;
}
</style>
