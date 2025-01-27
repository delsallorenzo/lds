<template>
  <div id="canvas" ref="canvas"></div>
</template>

<script>
import p5 from 'p5'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CanvasComponent',
  mounted() {
    this.createSketch()
    window.addEventListener('resize', this.windowResized)
  },
  methods: {
    scaleValue() {
      return window.innerWidth <= 900 ? 1 : 2
    },
    createSketch() {
      const sketch = (p) => {
        let obj
        let angleX = 0
        let angleY = 0

        let beta = 0
        let gamma = 0

        p.preload = () => {
          obj = p.loadModel('/3d/model.obj', true)
        }
        p.setup = () => {
          const container = this.$refs.canvas
          p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL)
        }
        p.draw = () => {
          p.background(220)

          const maxAngle = p.PI / 4.5
          const time = p.millis() * 0.001
          const betaOffset = p.sin(time * 0.05) * 45
          const gammaOffset = p.cos(time * 0.08) * 45

          // If on mobile, use gyroscope data for rotation
          if (window.innerWidth <= 900) {
            angleX = p.map(beta + betaOffset, -90, 90, 0, 90)
            angleY = p.map(gamma + gammaOffset, -90, 90, 0, 90)
          } else {
            // Otherwise, use mouse for rotation
            angleX = p.map(p.mouseY, 0, p.height, -maxAngle, maxAngle)
            angleY = p.map(p.mouseX, 0, p.width, -maxAngle, maxAngle)
          }

          p.rotateX(angleX)
          p.rotateY(angleY)
          p.noStroke()
          p.pointLight(255, 255, 255, window.innerWidth / 2, window.innerHeight / 2, 100)
          p.specularMaterial(255, 255, 255)
          p.shininess(100)
          p.fill(0)

          const widthRatio = p.map(window.innerWidth, 0, 1920, 1, 2)
          const heightRatio = p.map(window.innerHeight, 0, 1080, 1, 2)
          const ratio = Math.min(widthRatio, heightRatio)
          p.scale(ratio, -ratio, ratio)
          
          p.model(obj)
        }
      }
      this.p5Instance = new p5(sketch, this.$refs.canvas)
    },
    windowResized() {
      this.p5Instance.remove()
      this.createSketch()
    },
    beforeDestroy() {
      this.p5Instance.remove()
      window.removeEventListener('resize', this.windowResized)
    }
  }
})
</script>

<style>
#canvas {
  width: 100%;
  height: 100%;
}
</style>
