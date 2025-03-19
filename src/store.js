import { reactive } from 'vue'

export const store = reactive({
  descriptionStatus: false,
  moreInfoStatus: false,
  headerStatus: false,
  mobile: window.innerWidth < 900,
  theme: localStorage.getItem('theme') || 'light', // Default to light theme

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

  toggleMoreInfo() {
    this.moreInfoStatus = !this.moreInfoStatus
  },
  
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    this.applyTheme()
  },
  
  setTheme(theme) {
    this.theme = theme
    this.applyTheme()
  },
  
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme)
    localStorage.setItem('theme', this.theme)
  },
  
  initTheme() {
    this.applyTheme()
  }
})
