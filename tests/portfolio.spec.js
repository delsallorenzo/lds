import { test, expect } from '@playwright/test'

const reveal = async page => {
  await expect(page.locator('.video-layer')).toHaveCount(3)
  await expect(page.locator('.curtain')).toHaveCount(0, { timeout: 10000 })
}
const move = async (page, direction) => page.locator('.swiper').evaluate((element, direction) => element.swiper[direction === 'next' ? 'slideNext' : 'slidePrev'](0), direction)

test('three circular neighbors, only active playback, gallery and canvas on demand', async ({ page }) => {
  const requests = []
  const errors = []
  page.on('request', request => requests.push(request.url()))
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await reveal(page)
  await expect(page.locator('.video-layer')).toHaveCount(3)
  await expect(page.locator('canvas, .gallery-image')).toHaveCount(0)
  expect(requests.some(url => /images\/optimized|model-|Canvas-/.test(url))).toBe(false)
  await expect(page.locator('.video-layer.active iframe')).toHaveCSS('opacity', '1', { timeout: 20000 })
  await expect.poll(async () => page.evaluate(async () => (await Promise.all(window.Kinescope.IframePlayer.getAll().map(player => player.isPaused()))).filter(paused => !paused).length)).toBe(1)
  await expect.poll(async () => page.locator('.video-layer.active iframe').evaluate(element => window.Kinescope.IframePlayer.getById(element.id).isPaused())).toBe(false)
  const pauseStates = await page.evaluate(async () => Promise.all(window.Kinescope.IframePlayer.getAll().map(async player => ({ paused: await player.isPaused(), muted: await player.isMuted() }))))
  expect(pauseStates.filter(state => !state.paused)).toHaveLength(1)
  expect(pauseStates.every(state => state.muted)).toBe(true)

  const seen = []
  const firstLayer = await page.locator('.video-layer.active').elementHandle()
  for (const index of [1, 2, 3, 4, 5, 6, 0]) {
    await move(page, 'next')
    await expect(page.locator('.video-layer')).toHaveCount(3)
    await expect.poll(() => page.locator('.swiper').evaluate(element => element.swiper.realIndex)).toBe(index)
    await expect(page.locator('.video-layer.active')).toHaveCount(1)
    seen.push(index)
    if (index === 1) {
      expect(await firstLayer.evaluate(element => element.isConnected)).toBe(true)
      await expect.poll(() => page.locator('mux-video').evaluate(element => element.paused)).toBe(false)
    }
  }
  await move(page, 'prev')
  await expect(page.locator('.swiper-slide-active .description-button .text-box')).toHaveText('I Miei Alibi')
  await move(page, 'next')
  expect(seen).toEqual([1, 2, 3, 4, 5, 6, 0])

  await page.locator('.swiper-slide-active .description-button').click()
  await page.locator('.swiper-slide-active .more-info-button').click()
  await expect(page.locator('.swiper-slide-active .gallery-image')).toHaveCount(4)
  await expect.poll(() => page.locator('.swiper-slide-active .gallery-image').first().evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.locator('.info-button').click()
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15000 })
  await page.locator('.info-button').click()
  await expect(page.locator('canvas')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('unavailable player cannot trap the portfolio behind the intro', async ({ page }) => {
  await page.route('https://**/*', route => route.abort())
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await reveal(page)
  await expect(page.locator('main')).not.toHaveAttribute('inert', '')
  await expect(page.locator('.video-poster')).toHaveCount(1)
  await expect(page.locator('.info-button')).toBeEnabled()
})

test('slow player holds the same curtain, then reveals a poster within the timeout', async ({ page }) => {
  await page.route('**/iframe.player.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 9000))
    await route.abort()
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.curtain.cover')).toBeVisible({ timeout: 4500 })
  await page.waitForTimeout(650)
  await expect(page.locator('.animation__container')).toHaveCount(0)
  await expect(page.locator('.curtain')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
  await reveal(page)
})

test('mobile layout and reduced motion preserve usable navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('https://**/*', route => route.abort())
  await page.goto('/#goto', { waitUntil: 'domcontentloaded' })
  await reveal(page)
  await expect(page.locator('.swiper-slide-active .description-button .text-box')).toHaveText('Goto')
  await page.locator('.swiper-slide-active .description-button').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.swiper-slide-active .description-container')).toHaveClass(/open/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('static HTML, canonical, robots, sitemap and seven project pages work without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4174/')
  await expect(page.locator('h1')).toHaveText('Lorenzo Del Sal')
  await expect(page.locator('.project-list article')).toHaveCount(7)
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://lorenzodelsal.com/')
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap: https://lorenzodelsal.com/sitemap.xml')
  expect(await robots.text()).not.toContain('<html')
  const sitemap = await request.get('/sitemap.xml')
  const xml = await sitemap.text()
  expect(xml.match(/<loc>/g)).toHaveLength(8)
  const links = await page.locator('.project-list h2 a').evaluateAll(elements => elements.map(element => element.getAttribute('href')))
  for (const link of links) {
    await page.goto(`http://127.0.0.1:4174${link}`)
    await expect(page.locator('h1')).not.toBeEmpty()
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://lorenzodelsal.com${link}`)
    await expect(page.locator('iframe')).toHaveCount(0)
    await expect(page.locator('[data-video]')).toBeVisible()
  }
  await context.close()
})
