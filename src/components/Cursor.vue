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
  font-size: 15px;
  color: black;
  pointer-events: none;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  filter: invert(1);
  z-index: 2;
}

@media screen and (max-width: 800px) {
  .cursor__label {
    display: none;
  }
}
</style>
