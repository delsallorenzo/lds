import { reactive } from 'vue'
import projectList from './assets/projectList.json'

export const store = reactive({
  descriptionStatus: false,
  headerStatus: false,
  theme: localStorage.getItem('theme') || 'light', // Default to light theme
  activeSlideIndex: Math.max(0, projectList.projects.findIndex(project => project.slug === window.location.hash.slice(1))),

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
