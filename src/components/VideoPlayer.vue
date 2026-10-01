<template>
  <div class="video-layer" :class="{ active }" :aria-hidden="!active">
    <img v-if="active" class="video-poster" :src="project.poster" :alt="project.title" fetchpriority="high" />
    <iframe v-if="isKinescope" ref="frame" :id="iframeId" :title="project.title" tabindex="-1" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" :style="{ opacity: playing ? 1 : 0 }"></iframe>
    <mux-video v-else-if="muxLoaded" ref="mux" :playback-id="project.media.split('/').pop()" :aria-label="project.title" :muted.attr="true" loop playsinline preload="auto" tabindex="-1" :style="{ opacity: playing ? 1 : 0 }" @playing="onPlaying" @loadedmetadata="syncPlayback" @canplay="syncPlayback" @error="onError" />
  </div>
</template>

<script>
import { load } from '@kinescope/player-iframe-api-loader'
let factoryPromise
let instanceCount = 0
const getFactory = () => factoryPromise ||= load('v2.198.3').catch(error => {
  factoryPromise = undefined
  throw error
})
</script>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ project: { type: Object, required: true }, active: Boolean })
const emit = defineEmits(['ready', 'failed'])
const isKinescope = props.project.media.includes('kinescope.io')
const iframeId = `lds-video-${++instanceCount}`
const frame = ref(null)
const mux = ref(null)
const muxLoaded = ref(false)
const playing = ref(false)
let player
let disposed = false

const onPlaying = () => {
  if (props.active) {
    playing.value = true
    emit('ready')
  } else syncPlayback()
}
const onError = () => {
  playing.value = false
  emit('failed')
}
const syncPlayback = async () => {
  const target = player || mux.value
  if (!target || disposed) return
  try {
    if (props.active && !document.hidden) await target.play()
    else await target.pause()
  } catch {
    if (props.active) onError()
  }
}
watch(() => props.active, syncPlayback, { flush: 'post' })
watch(mux, syncPlayback)

onMounted(async () => {
  document.addEventListener('visibilitychange', syncPlayback)
  try {
    if (isKinescope) {
      const factory = await getFactory()
      if (disposed) return
      player = await factory.create(frame.value, {
        url: props.project.media,
        keepElement: true,
        timeout: 8000,
        behavior: { preload: 'auto', autoPlay: false, autoPause: false, muted: true, loop: true, keyboard: false, localStorage: false },
        ui: { controls: false, mainPlayButton: false }
      })
      if (disposed) {
        await player.destroy()
        return
      }
      player.on(player.Events.Playing, onPlaying)
      player.on(player.Events.Loaded, syncPlayback)
      player.on(player.Events.Error, onError)
      await syncPlayback()
    } else {
      await import('@mux/mux-video')
      if (!disposed) muxLoaded.value = true
    }
  } catch {
    if (!disposed) onError()
  }
})
onBeforeUnmount(() => {
  disposed = true
  document.removeEventListener('visibilitychange', syncPlayback)
  player?.destroy().catch(() => {})
  mux.value?.pause()
})
</script>

<style scoped>
.video-layer { position: fixed; inset: 0; z-index: 0; visibility: hidden; pointer-events: none; background: black; }
.video-layer.active { visibility: visible; }
.video-poster, iframe, mux-video { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; object-fit: contain; }
mux-video { object-fit: contain; }
</style>
