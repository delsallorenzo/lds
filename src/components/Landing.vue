<template>
  <div class="animation__container">
    <div class="loading-page">
      <Vue3Lottie
        ref="anim"
        :animationData="animation"
        :delay="2000"
        class="animation__wrapper"
        :loop="false"
        @onComplete="this.stopAnimation()"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import animation from '@/assets/lds-logo-animation.json'
import { Vue3Lottie } from 'vue3-lottie'

export default defineComponent({
  name: 'LandingComponent',
  components: { Vue3Lottie },
  data() {
    return {
      removeBackground: false,
      animation
    }
  },
  methods: {
    play() {
      this.$refs.anim.play()
    },
    stopAnimation() {
      this.$refs.anim.stop()
      this.removeBackground = false
      this.$emit('animationDone')
    }
  },
  mounted() {
    setTimeout(() => {
      this.removeBackground = true
      this.play()
    }, 500)
  }
})
</script>

<style scoped lang="scss">
.animation__container {
  & .white__slide {
    position: fixed;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    z-index: 999;
    background-color: white;
    transition: transform 0.5s cubic-bezier(1, 0, 0, 0.9);
    transform: translateY(0);

    &.active__slide {
      transform: translateY(100%);
    }
  }

  & .loading-page {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100svh;
    width: 100svw;
    z-index: 998;

    & .animation__wrapper {
      max-width: 20%;
      max-height: 20%;
      filter: invert(1) blur(5px);
      background-color: transparent;
    }
  }
}
</style>
