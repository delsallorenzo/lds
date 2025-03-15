import { reactive } from 'vue'

export const store = reactive({
  descriptionStatus: false,
  moreInfoStatus: false,
  headerStatus: false,
  mobile: window.innerWidth < 900,

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
  }
})
