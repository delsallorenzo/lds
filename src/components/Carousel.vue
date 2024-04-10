<template>
  <Cursor :label="cursorLabel" :cursorX="cursorX" :cursorY="cursorY" />
  <swiper
    :loop="true"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
    @mousemove="handleMouseMove($event)"
  >
    <SwiperSlide
      v-for="project in this.slides"
      :key="project"
      class="carousel__slide"
      @click="handleClick($event)"
    >
      <Project :project="project" />
    </SwiperSlide>
  </swiper>
</template>

<script>
import { defineComponent } from 'vue'
import Cursor from './Cursor.vue'
import Project from './Project.vue'
import projectList from '@/assets/projectList.json'
import { store } from '@/store'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

export default defineComponent({
  name: 'CarouselComponent',
  components: {
    Cursor,
    Project,
    Swiper,
    SwiperSlide
  },
  setup() {
    const onSwiper = () => {}
    const onSlideChange = () => {}
    return {
      onSwiper,
      onSlideChange
    }
  },
  data() {
    return {
      cursorLabel: '',
      cursorX: 0,
      cursorY: 0,
      slides: [],
      store
    }
  },
  methods: {
    handleClick(event) {
      const swiper = document.querySelector('.swiper').swiper
      if (event.target.className == 'video' && window.innerWidth > 900) {
        const clickX = event.clientX
        clickX > window.innerWidth / 2 ? swiper.slideNext() : swiper.slidePrev()
      }
    },
    handleMouseMove(event) {
      this.cursorX = event.clientX
      this.cursorY = event.clientY
      if (event.target.className == 'video') {
        this.cursorLabel = event.clientX > window.innerWidth / 2 ? 'Next' : 'Prev'
      } else {
        this.cursorLabel = ''
      }
    },
    async fetchSlides() {
      try {
        this.slides = projectList.projects
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  },
  created() {
    this.fetchSlides()
    let touchstartY = 0
    let touchendY = 0
    const threshold = 100

    document.addEventListener('touchstart', (e) => {
      touchstartY = e.changedTouches[0].screenY
    })

    document.addEventListener('touchend', (e) => {
      touchendY = e.changedTouches[0].screenY

      if (!store.descriptionStatus && !store.headerStatus) {
        // nothing is toggled
        if (touchendY < touchstartY - threshold) {
          // swipe up, open description
          // this.emitter("toggleDescription", true);
          store.descriptionStatus = true
        } else if (touchendY > touchstartY + threshold) {
          // swipe down, open header
          // this.emitter("toggleHeader", true);
          store.headerStatus = true
        }
      } else if (store.descriptionStatus) {
        // description is toggled
        if (touchendY > touchstartY + threshold) {
          // swipe down, close description
          // this.emitter("toggleDescription", false);
          store.descriptionStatus = false
        }
      } else if (store.headerStatus) {
        // header is toggled
        if (touchendY < touchstartY - threshold) {
          // swipe up, close header
          // this.emitter("toggleHeader", false);
          store.headerStatus = false
        }
      }
    })
  }
})
</script>

<style>
.carousel__slide {
  height: 100svh;
  display: flex;
  flex-direction: column;
}
</style>
