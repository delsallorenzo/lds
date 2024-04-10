<template>
  <section v-if="loaded">
    <Header />
    <Carousel />
  </section>
  <Landing v-else @animationDone="this.loaded = true" />
</template>

<script>
import Carousel from '@/components/Carousel.vue'
import Header from './components/Header.vue'
import Landing from './components/Landing.vue'

export default {
  name: 'App',
  components: {
    Header,
    Carousel,
    Landing
  },
  data() {
    return {
      loaded: false
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
  background: black;
}
@font-face {
  font-family: 'OverusedGrotesk';
  font-weight: 500;
  font-style: normal;
  font-display: auto;
  unicode-range: U+000-5FF;
  src:
    local('OverusedGrotesk'),
    url('../public/fonts/OverusedGrotesk/OverusedGroteskSemiBold.woff2') format('woff2'),
    url('../public/fonts/OverusedGrotesk/OverusedGroteskSemiBold.woff') format('woff');
}

#app {
  font: 500 16px 'OverusedGrotesk';
  letter-spacing: -0.25px;
  line-height: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
