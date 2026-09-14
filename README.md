# Emmett Redding’s website

The published site is ordinary HTML, CSS and a few small JavaScript enhancements. Articles are written in Markdown and converted to HTML **before publication**; reading them does not require JavaScript or an external Markdown service.

## Edit and build

Requires Node.js 20 or newer and Python 3.

```sh
npm ci
npm run build
npm run check
python3 -m http.server 8765
```

Open http://localhost:8765. Run the build again after changing a template or Markdown file, then refresh the browser.

- `templates/home.html`: homepage content and project descriptions.
- `templates/layout.html`: shared header, footer and page metadata.
- `works/*.md`, `pages/*.md`, `blog/*.md`, `hidden/*.md`: article sources.
- `style.css`: main site styles, including light, dark and starfield themes.
- `assets/site.js`: theme buttons, snow, video switchers and image galleries.
- `assets/appearance.js`: restores appearance before the page paints.
- `food/posts/*.md` and `templates/food-*.html`: food section sources.
- `food/food-style.css` and `food/article.css`: food section styling.
- `teaching/colourwheel.html`: standalone interactive page; edit directly.

`npm run build` refreshes the food manifest and generates `index.html`, each article’s `index.html`, the food review index, and legacy route mappings. **Edit the sources rather than generated pages.** Commit the generated HTML alongside the sources so the existing static hosting setup can publish the repository directly, without a server or hosting build command. Nothing is automatically deployed by these commands.

## Addresses and compatibility

`works/zeman.md` builds to `/works/zeman/`; `pages/pathofthejedi.md` builds to `/pages/pathofthejedi/`. Food posts build to `/food/posts/<name>/`. Existing `?post=...` links redirect to their corresponding page, preserving fragments such as podcast headings and footnotes. `/food/?reviews` redirects to `/food/reviews/`. Those legacy query-string redirects require JavaScript; the new page addresses do not.

The duplicate blog version of Path of the Jedi redirects to the main article. Files in `hidden/` remain unlisted and receive `noindex` metadata; they are not private or access-controlled.

## Video providers

The Zeman and Jedi Markdown files each contain a `.video-switcher` with a descriptive `data-title`, two provider buttons and one iframe. Update the button’s `data-video-src` and the matching external watch link when changing a video. Preserve the `h` parameter for unlisted Vimeo videos. Without JavaScript, the default video and both external watch links remain available.

Light/dark and starfield preferences are stored in the browser. Path of the Jedi defaults to stars unless a visitor has saved an appearance preference. Food retains its separate visual design. Review search, sorting and tags enhance an already-rendered list; all reviews remain accessible without JavaScript.
