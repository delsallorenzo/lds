document.querySelector('[data-video]')?.addEventListener('click', event => {
  const button = event.currentTarget
  const url = new URL(button.dataset.video)
  if (!['kinescope.io', 'player.mux.com'].includes(url.hostname)) return
  const iframe = document.createElement('iframe')
  iframe.src = url.href
  iframe.title = button.getAttribute('aria-label')
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'
  iframe.allowFullscreen = true
  button.parentElement.replaceChildren(iframe)
})
