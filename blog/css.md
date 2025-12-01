# A Little Tour of This Site’s CSS

### *A reference post for testing how everything looks on this website.*

I’ve been refining the look of this site—gradients, purple accents, link hovers, card shadows, the starfield, all of it.  
This post is a quick showcase of the elements my Markdown renderer supports. It’s useful for testing, debugging, and making sure future CSS changes don’t break anything.

---

## Typography

### Headings

#### H4 Heading  
##### H5 Heading  

Here’s some regular text with **bold**, *italic*, and <mark>highlighted text</mark>.  
Links get your usual purple/yellow hover treatment.

---

## Lists

Unordered:

- First item  
- Second item  
  - Nested child  
- Third item  

Ordered:

1. One  
2. Two  
   1. Nested  
   2. Nested  
3. Three  

---

## Links

- [A normal link](#)
- [A visited-style link](#){:class="visited"}
- [A hover-style link](#){:class="hover"}

---

## Blockquotes

> This is a blockquote.  
> Your CSS gives it a coloured edge and a subtle background highlight.

---

## Images

Images get rounded corners and a soft shadow automatically:

![Example screenshot](/images/works/zeman-video-essay/zemantitleimage.webp)

---

## Code Blocks

Inline: `let x = 10`

Fenced:

```css
a:hover {
    background-color: var(--highlight);
    color: var(--text-highlight);
    box-shadow: 3px 3px 0px var(--visited);
}
```

```js
function greet(name) {
    return `Hello, ${name}!`;
}
```

---

## Preformatted Text

```
This is a preformatted block.
    Indentation is preserved.
        Line breaks are preserved.
```

---

## Horizontal Rule

---

Clean divider shown above.

---

## Footnotes

Footnotes show up as your yellow badge elements:

A small fact goes here.[^1]

[^1]: This is a footnote. Your CSS renders it like a little highlight badge.

---

## Small Text

<small>This is small text, styled to appear softer and quieter.</small>

---

## Spoiler Test

<span class="spoiler">This is a spoiler-style span.</span>

---

## Embeds & Grids

### YouTube embed

<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>

### Image grid

<div class="image-grid image-grid-4">
  <figure>
    <img src="/images/works/on-ornithology/onornithology-title.webp">
    <figcaption>Grid item 1</figcaption>
  </figure>
  <figure>
    <img src="/images/works/yesno/yesno-title.webp">
    <figcaption>Grid item 2</figcaption>
  </figure>
  <figure>
    <img src="/images/works/humanimals/humanimals-title.webp">
    <figcaption>Grid item 3</figcaption>
  </figure>
  <figure>
    <img src="/images/works/running-late/runninglate-title.webp">
    <figcaption>Grid item 4</figcaption>
  </figure>
</div>

---

## Star Wars Page Test

<div class="sw-page-shell">
  <div class="sw-page-bg">
    <div class="sw-page-card">
      <h3>Starfield Test Section</h3>
      <p>This is how content appears on special themed pages like Path of the Jedi.</p>
    </div>
  </div>
</div>

---

## Closing

This post exists mainly for CSS testing—when refining visuals, it helps to have a single page showing every Markdown element your site supports.

If you want a version showcasing dark mode toggles, callout boxes, or code syntax highlighting, just ask.
