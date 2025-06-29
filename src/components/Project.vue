<template>
  <div class="carousel__item" ref="carouselItem">
    <div class="video-wrapper">
      <video ref="videoElement" autoplay muted loop playsinline class="video">
        <source :src="project.media" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <ButtonComponent
        :textBox="project.title"
        :opened="store.descriptionStatus"
        @click="store.toggleDescription()"
        class="problematic-element"
      />
    </div>
    <div
      class="description__wrapper"
      :class="{ expand: store.descriptionStatus }"
      @mousedown.stop
      @touchstart.stop
    >
      <div class="description__content">
        <p class="description__paragraph">{{ project.desc }}</p>
        <LinkComponent
          v-show="project.link"
          :text="project.linkText"
          :link="project.link"
          class="description__link"
        />
      </div>
      <!-- <ExtraInfoProject :project="project" /> -->
      <ButtonComponent
        :textBox="store.moreInfoStatus ? 'Close' : 'More Info'"
        :opened="store.moreInfoStatus"
        @click="store.toggleMoreInfo()"
        v-if="project.extraInfo?.pictures && project.extraInfo.pictures.length > 0"
      />
      <div class="extra-info-gallery" v-if="project.extraInfo?.pictures" v-show="showPicture">
        <picture
          v-for="(picture, index) in project.extraInfo.pictures"
          :key="index"
          class="gallery-picture"
        >
          <img :src="picture" class="gallery-image" loading="lazy" decoding="async" />
        </picture>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/Button.vue'
import LinkComponent from '@/components/Link.vue'
import { Project } from '@/models/project.model'
import { store } from '@/store.js'
import { computed } from 'vue'

defineProps<{
  project: Project
}>()

const showPicture = computed(() => store.moreInfoStatus)
</script>

<style scoped lang="scss">
.carousel__item {
  height: 100svh;
  width: 100svw;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
  & .video-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;

    &:hover video {
      cursor: none;
    }

    & video {
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
}

.description__wrapper {
  background: linear-gradient(to bottom, #f4f4f4, #e5e5e5);

  width: 100%;
  max-height: 0;
  height: auto;
  transition: all 0.5s cubic-bezier(1, 0, 0, 0.9);
  overflow-y: auto;

  &.expand {
    max-height: max-content;
    height: 100%;
  }

  & .description__content {
    display: flex;
    flex-flow: row;

    & .description__paragraph {
      margin: 9px 10px 10px 10px;
      flex: 2;
      text-align: start;
      max-width: 75%;
    }

    & .description__link {
      flex: 1;
      justify-content: flex-end;
      align-items: flex-end;
      padding: 10px;
    }
  }
}

.extra-info-gallery {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  width: 100%;
  max-height: 100%;

  & .gallery-picture {
    width: calc(100% / 3 - 20px);
    margin: 10px;
    position: relative;
    flex: 1;

    & .gallery-image {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 10px;
    }
  }
}

// https://stackoverflow.com/questions/61801579/vue-js-rendering-issues-with-safari
.problematic-element {
  min-width: 0%;
  transform: translateZ(0);
}

@media screen and (max-width: 800px) {
  .description__wrapper .description__content {
    flex-flow: column;

    & .description__paragraph {
      max-width: 100%;
    }
  }

  .extra-info-gallery {
    flex-flow: column;
    width: 100%;
    max-height: 100%;

    & .gallery-picture {
      width: 100%;
      margin: 10px 0;
    }
  }
}
</style>
