import { reactive } from 'vue'

export const store = reactive({
  descriptionStatus: false,
  headerStatus: false,
  theme: localStorage.getItem('theme') || 'light', // Default to light theme
  activeSlideIndex: 0,

  toggleHeader() {
    this.headerStatus = !this.headerStatus

    if (this.headerStatus) {
      this.descriptionStatus = false
    }
  },

  toggleDescription() {
    this.descriptionStatus = !this.descriptionStatus

    if (this.descriptionStatus) {
      this.headerStatus = false
    }
  },

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.applyTheme()
  },
  
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme)
    localStorage.setItem('theme', this.theme)
  }
})
