import { reactive } from 'vue'

export const store = reactive({
  descriptionStatus: false,
  moreInfoStatus: false,
  headerStatus: false,
  mobile: window.innerWidth < 900,
  theme: localStorage.getItem('theme') || 'light', // Default to light theme
  activeMoreInfoProjectId: null, // Track the currently open project

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

  toggleMoreInfo(projectId) {
    if (this.activeMoreInfoProjectId === projectId) {
      // If clicking the currently open project, close it
      this.activeMoreInfoProjectId = null;
      this.moreInfoStatus = false;
    } else {
      // Otherwise, open the new project and track its ID
      this.activeMoreInfoProjectId = projectId;
      this.moreInfoStatus = true;
    }
  },
  
  isMoreInfoOpen(projectId) {
    return this.moreInfoStatus && this.activeMoreInfoProjectId === projectId;
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
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      const newTheme = e.matches ? 'dark' : 'light'
      this.setTheme(newTheme)
    })
  }
})
