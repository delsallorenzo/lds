<template>
  <Cursor :label="cursorLabel" :cursorX="cursorX" :cursorY="cursorY" />
  <swiper
    :loop="true"
    :initialSlide="store.activeSlideIndex"
    :modules="[Keyboard]"
    :keyboard="{ enabled: true }"
    :allowTouchMove="false"
    :speed="800"
    cssEase="cubic-bezier(0.86, 0, 0.07, 1)"
    @slideChange="swiper => store.activeSlideIndex = swiper.realIndex"
    @mousemove="handleMouseMove($event)"
  >
    <SwiperSlide
      v-for="project in this.slides"
      :key="project.slug"
      class="carousel__slide"
      @click="handleClick($event)"
    >
      <Project :project="project" :active="store.activeSlideIndex === slides.indexOf(project)" />
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
import { Keyboard } from 'swiper/modules'
import 'swiper/css'

export default defineComponent({
  name: 'CarouselComponent',
  components: {
    Cursor,
    Project,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      cursorLabel: '',
      cursorX: 0,
      cursorY: 0,
      slides: projectList.projects,
      store,
      Keyboard
    }
  },
  methods: {
    handleClick(event) {
      
      const swiper = document.querySelector('.swiper').swiper
      if (event.target.closest('.video, .iframe-wrap')) {
        const clickX = event.clientX
        clickX > window.innerWidth / 2 ? swiper.slideNext(0) : swiper.slidePrev(0)
      }
    },
    handleMouseMove(event) {
      this.cursorX = event.clientX
      this.cursorY = event.clientY
      if (event.target.closest('.video, .iframe-wrap')) {
        this.cursorLabel = event.clientX > window.innerWidth / 2 ? 'Next' : 'Prev'
      } else {
        this.cursorLabel = ''
      }
    }
  },
  created() {
    let touchstartY = 0
    let touchendY = 0
    const threshold = 100

    document.addEventListener('touchstart', (e) => {
      touchstartY = e.changedTouches[0].screenY
    })

    document.addEventListener('touchend', (e) => {
      touchendY = e.changedTouches[0].screenY

      if (!store.descriptionStatus && !store.headerStatus) {
        if (touchendY < touchstartY - threshold) {
          store.descriptionStatus = true
        } else if (touchendY > touchstartY + threshold) {
          store.headerStatus = true
        }
      } else if (store.descriptionStatus) {
        if (touchendY > touchstartY + threshold) {
          store.descriptionStatus = false
        }
      } else if (store.headerStatus) {
        if (touchendY < touchstartY - threshold) {
          store.headerStatus = false
        }
      }
    })
  }
})
</script>

<style scoped>
.carousel__slide {
  height: 100svh;
  display: flex;
  flex-direction: column;
}
</style>
