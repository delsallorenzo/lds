<template>
  <div class="toggle-container">
    <button 
      class="toggle-switch" 
      :class="{ 'toggle-switch--active': store.theme === 'dark' }"
      @click="store.toggleTheme()"
      aria-label="Toggle theme"
    >
      <span class="toggle-switch__knob"></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { store } from '../store'
</script>

<style scoped lang="scss">
.toggle-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 16px;
}

.toggle-label {
  font-size: 14px;
}

.toggle-switch {
  position: relative;
  width: 47px;
  height: 26px;
  border-radius: 34px;
  background-color: var(--secondary-color);
  transition: background-color 0.3s;
  padding: 0;
  border: none;
  cursor: pointer;

  &__knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: var(--primary-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;
    
    .toggle-switch--active & {
      transform: translateX(21px);
    }
  }
}
</style>
