<template>
  <section class="animation__container">
    <Vue3Lottie
      ref="anim"
      :animationData="animation"
      :delay="1000"
      class="animation__wrapper"
      :loop="false"
      @onComplete="handleAnimationComplete"
    />
    <div
      class="curtain"
      :class="{ dropFromTop: curtainDrop }"
      @animationend="handleCurtainAnimationEnd"
    ></div>
  </section>
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
      curtainDrop: false,
      animation
    }
  },
  methods: {
    play() {
      this.$refs.anim.play()
    },
    handleAnimationComplete() {
      this.curtainDrop = true
    },
    handleCurtainAnimationEnd() {
      this.$emit('animationDone')
    }
  },
  mounted() {
    this.play()
  }
})
</script>

<style scoped lang="scss">
.animation__container {
  display: flex;
  align-items: center;
  height: 100svh;
  width: 100svw;
  background: black;

  & .animation__wrapper {
    max-width: 20%;
    max-height: 20%;
    filter: invert(1) blur(5px);
  }
}
</style>
