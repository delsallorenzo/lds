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
  font-family: 'UncutSans';
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  unicode-range: U+000-5FF;
  src:
    url('/fonts/UncutSans/UncutSans-Semibold.woff2') format('woff2'),
    url('/fonts/UncutSans/UncutSans-Semibold.woff') format('woff');
}

#app {
  font: 600 16px 'UncutSans', Arial, sans-serif;
  letter-spacing: -0.25px;
  line-height: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.curtain {
  position: fixed;
  height: 100svh;
  width: 100svw;
  background: rgb(245, 245, 245);
  transform: translateY(-100%);
  z-index: 999;

  &.dropFromTop {
    animation-name: drop-down-from-top;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  &.dropToBottom {
    animation-name: drop-down-to-bottom;
    animation-duration: 0.5s;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  @keyframes drop-down-from-top {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes drop-down-to-bottom {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
}
</style>
