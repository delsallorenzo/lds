<template>
  <div 
    class="draggable-child"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mousemove="onDrag"
    @touchmove="onDrag"
    @mouseup="endDrag"
    @touchend="endDrag"
    @mouseleave="endDrag"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialX: { type: Number, default: 0 },
  initialY: { type: Number, default: 0 }
});

const dragging = ref(false);
const position = ref({ x: props.initialX, y: props.initialY });
const startPos = ref({ x: 0, y: 0 });
const dragOffset = ref({ x: 0, y: 0 });

const getPosition = (event) => {
  const posX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
  const posY = event.type.includes('mouse') ? event.clientY : event.touches[0].clientY;
  return { x: posX, y: posY };
};

const startDrag = (event) => {
  dragging.value = true;
  const pos = getPosition(event);
  dragOffset.value.x = pos.x - position.value.x;
  dragOffset.value.y = pos.y - position.value.y;
  event.stopPropagation();
};

const onDrag = (event) => {
  if (!dragging.value) return;
  const pos = getPosition(event);
  position.value.x = pos.x - dragOffset.value.x;
  position.value.y = pos.y - dragOffset.value.y;
  event.stopPropagation();
  event.preventDefault();
};

const endDrag = () => {
  dragging.value = false;
};
</script>

<style scoped>
.draggable-child {
  touch-action: none;
  user-select: none;
  cursor: grab;
  position: relative;
}

.draggable-child:active {
  cursor: grabbing;
}
</style>
