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
  computed: {
    scaleValue() {
      // Detect whether the device is mobile or desktop
      return window.innerWidth <= 900 ? 1 : 2 // Adjust this threshold according to your preference
    }
  },
  methods: {
    createSketch() {
      const sketch = (p) => {
        let obj
        let angleX = 0
        let angleY = 0

        let beta = 0 // For device orientation
        let gamma = 0 // For device orientation

        p.preload = () => {
          obj = p.loadModel(
            'https://raw.githubusercontent.com/file098/lds/main/public/3d/model.obj',
            true
          )
        }
        p.setup = () => {
          const container = this.$refs.canvas
          p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL)
        }
        p.windowResized = () => {
          const container = this.$refs.canvas
          p.resizeCanvas(container.offsetWidth, container.offsetHeight)
        }
        p.draw = () => {
          p.background(220)
          const maxAngle = p.PI / 4.5

          // Oscillate beta and gamma values over time
          const time = p.millis() * 0.001 // Convert millis to seconds
          const betaOffset = p.sin(time * 0.05) * 45 // Adjust frequency and amplitude as needed
          const gammaOffset = p.cos(time * 0.08) * 45 // Adjust frequency and amplitude as needed

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
          p.scale(this.scaleValue, -this.scaleValue, this.scaleValue)
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
