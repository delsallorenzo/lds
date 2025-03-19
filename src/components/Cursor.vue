<template>
  <div class="cursor__label" :style="{ top: cursorY + 'px', left: cursorX + 'px' }">
    {{ label }}
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CursorComponent',
  props: {
    label: { type: String, required: true },
    cursorX: { type: Number, required: true },
    cursorY: { type: Number, required: true }
  }
})
</script>

<style scoped>
.cursor__label {
  position: absolute;
  font-size: 16px;
  color: white; 
  background-color: black;
  padding: 2px 5px;
  border-radius: 4px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  mix-blend-mode: exclusion; 
  z-index: 1000;
  font-weight: bold;
  text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8);
}

@media screen and (max-width: 800px) {
  .cursor__label {
    display: none;
  }
}
</style>
