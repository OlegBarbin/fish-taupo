# Birthday card — Taupō

A one-page static birthday card. No build step, no dependencies.

```
index.html      all the markup and all the copy
css/style.css   theme (palette + type live at the top in :root)
js/main.js      envelope, scroll reveals, parallax, lightbox
images/         pod.jpg · bath.jpg · paddock.jpg · boat.png
```

## Writing your copy

Every bit of placeholder text is marked with an `✏️ EDIT` comment in `index.html`.
Find them all with:

```bash
grep -n "EDIT" index.html
```

Things to fill in:

- Her name — in the envelope **and** the hero (two places).
- The Airbnb link and the charter link — both are `href="#"` right now.
- Dates, times, suburb, charter name — the `[ ... ]` bits.
- The closing note and your signature.
- The itinerary — fill the four rows in, or delete the whole `<section class="plan">`.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use the server rather than double-clicking
`index.html` — opening it over `file://` behaves differently.

The envelope only shows once per browser session (it's remembered in
`sessionStorage`). To see it again, open a new private window or clear site data.

## Changing the look

The whole palette is at the top of `css/style.css`:

```css
--lake-deep: #0d2b3e;  /* hero + footer ground */
--tussock:   #c8963f;  /* golden accents */
--ember:     #e07a3f;  /* button, hover */
```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch →
   `main` / `/ (root)`** → Save.
3. Wait a minute, then open `https://<your-username>.github.io/<repo-name>/`.

All paths are relative, so it works from a sub-path with no config. The empty
`.nojekyll` file stops GitHub trying to run the files through Jekyll.

## Note on the images

`images/boat.png` is 679 KB — the others are all under 180 KB. If it feels slow
over mobile data, re-save it as a JPEG at ~80% quality and update the `src` in
`index.html`. There's no image tooling installed here, so it was left as-is.
