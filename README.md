# Lorenzo Del Sal — Portfolio

Vue 3 / Vite portfolio at https://lorenzodelsal.com, hosted on Cloudflare Pages (`lds`).

```sh
npm ci
npm run dev
npm run build
```

The build publishes an HTML fallback, seven static project pages, `robots.txt` and a sitemap with all eight pages. The homepage keeps the animated portfolio experience; project pages also work without JavaScript.

## Loading and media

- The LDS animation stops on its last frame, keeping the black background and logo until the first video starts (or a five-second video fallback). Only then does the curtain cover and reveal the portfolio, without a gray waiting screen. Galleries never block entry.
- Only the current, previous and next project players are mounted, wrapping around the carousel. Neighbors preload but remain paused; distant players are destroyed.
- Mux uses the video component without control UI. Kinescope uses its official iframe API, pinned to `v2.198.3`.
- Gallery images load when “More” is first opened. WebP variants come from `src/assets/images.json`.
- The p5 canvas mounts only while the information panel is open. The model keeps all vertices and faces with coordinates rounded to six decimals; its `.txt` extension enables normal text compression and its generated asset URL permits immutable caching.

After changing gallery originals, run `npm run images` to regenerate responsive images, posters, the social cover, image metadata and the compact model. Original images remain in `public/images/projects`; the original model is `src/assets/model.obj`.

## Verification

```sh
npm exec playwright install chromium
npm test
```

Tests cover circular neighbor reuse, actual muted playback, lazy galleries, canvas cleanup, player failures and slow responses, mobile keyboard access, reduced motion, and static SEO content without JavaScript. `LDS_CHROMIUM_PATH` can select an existing Chromium executable.

## Deployment

```sh
npm run deploy
```

For an explicit preview branch:

```sh
npm exec wrangler -- pages deploy dist --project-name lds --branch codex/preloader-seo-performance
```

Use the appropriate `CLOUDFLARE_ACCOUNT_ID` when the authenticated session has multiple accounts. The production branch is `main`; preview deployment does not publish to the custom production domain. The application entry script opts out of Rocket Loader using `data-cfasync="false"`.
