<template>
  <div class="box-wrapper">
    <div class="text-box">{{ textBox }}</div>
    <div
      class="x-icon"
      :style="{
        transform: opened ? 'rotate(45deg)' : 'rotate(0)'
      }"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="8.04114" y1="0.199951" x2="8.04114" y2="15.8" stroke="white" />
        <line x1="15.8" y1="8.04114" x2="0.199987" y2="8.04114" stroke="white" />
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ButtonComponent',
  props: {
    textBox: { type: String, required: true },
    opened: { type: Boolean, default: false }
  }
})
</script>

<style scoped>
.box-wrapper {
  display: inline-flex;
  gap: 5px;
  padding: 10px;
  z-index: 100;
  cursor: pointer;

  & > * {
    background: black;
    border-radius: 100px;
  }

  & .text-box {
    display: flex;
    align-items: center;
    color: white;
    padding: 0px 13px;
    line-height: 0px;
  }
}

.x-icon {
  display: flex;
  align-items: center;
  padding: 5px;
  transition: transform 0.5s ease-in-out;
}
</style>
