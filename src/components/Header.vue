<template>
  <header>
    <div
      class="info-container"
      :style="{
        transform: store.headerStatus ? 'translateY(0)' : 'translateY(-100%)'
      }"
    >
      <div class="title">
        <p v-for="(line, index) in projectList.header.description" :key="index">
          {{ line }}
        </p>
      </div>
      <div class="canvas__container">
        <Canvas></Canvas>
      </div>
      <div class="contacts__wrapper">
        <div class="services__list">
          <p>{{ projectList.header.services.title }}</p>
          <p v-for="(line, index) in projectList.header.services.list" :key="index">
            {{ line }}
          </p>
        </div>
        <div class="contacts">
          <LinkComponent :text="'Mail'" :link="'mailto:info@lorenzodelsal.com'" />
          <LinkComponent :text="'Instagram'" :link="'https://www.instagram.com/lorenzodelsal/'" />
        </div>
      </div>
      <div class="test">
        <ButtonComponent
          class="info-button"
          :opened="store.headerStatus"
          :textBox="'lds'"
          @click="store.toggleHeader()"
        />
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import ButtonComponent from '@/components/Button.vue'
import Canvas from '@/components/Canvas.vue'
import LinkComponent from '@/components/Link.vue'
import projectList from '@/assets/projectList.json'
import { store } from '@/store.js'

export default defineComponent({
  name: 'HeaderComponent',
  data() {
    return {
      projectList,
      store
    }
  },
  components: {
    ButtonComponent,
    LinkComponent,
    Canvas
  }
})
</script>

<style lang="scss">
$header-height: 50px;

.canvas__container {
  flex: 1;
}

.info-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: 90vh;

  display: flex;
  flex-flow: column;

  margin: 0;
  color: #000;
  background-color: rgb(220, 220, 220);
  z-index: 99;
  transition: transform 0.5s cubic-bezier(1, 0, 0, 0.9);

  .info-button {
    width: max-content;
    transform: translateY(100%);
  }

  p {
    margin: 0;
  }

  .title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 10px;
    margin-top: 10px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .contacts__wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin: 0 10px 10px 10px;

    .contacts__title {
      margin-left: 10px;
    }

    .contacts {
      display: flex;
      flex-flow: column;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
}

.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
}

.info-button {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(100%);
}

@media screen and (max-width: 800px) {
  .info-container {
    max-height: 87svh;
  }
}
</style>
