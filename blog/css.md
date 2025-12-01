# A Little Tour of This Site’s CSS

### *A reference post for testing how everything looks on this website.*

I’ve been updating the look of the site. Gradients, the purple accents, link hovers, card shadows, the starfield, all of it.
This page is a quick run-through of the Markdown elements that are supported. It helps with testing, fixing things, and making sure future updates don’t break anything.

---

## Typography

### Headings

#### H4 Heading  
##### H5 Heading  

Here’s some regular text with **bold**, *italic*, and <mark>highlighted text</mark>.  
Links use the usual purple and yellow hover styling.

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
- <a href="#" class="visited">A visited-style link</a>
- <a href="#" class="hover-demo">A hover-style link</a>

---

## Blockquotes

> This is a blockquote.  
> The CSS gives it a coloured edge and background highlight.

---

## Images

Images get rounded corners and a soft shadow automatically:

![Example screenshot](/theholmespage2000/images/works/zeman-video-essay/zemantitleimage.webp)

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

Divider shown above.

---

## Footnotes

Footnotes appear as yellow badge-style markers:

A small fact goes here.<sup id="ref-css-1"><a href="#fn-css-1">1</a></sup>

<small>
<p id="fn-css-1"><strong>1.</strong> This is a footnote. Your CSS renders it like a little highlight badge. <a href="#ref-css-1">↩</a></p>
</small>

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
    <img src="/theholmespage2000/images/works/on-ornithology/onornithology-title.webp">
    <figcaption>Grid item 1</figcaption>
  </figure>
  <figure>
    <img src="/theholmespage2000/images/works/yesno/yesno-title.webp">
    <figcaption>Grid item 2</figcaption>
  </figure>
  <figure>
    <img src="/theholmespage2000/images/works/humanimals/humanimals-title.webp">
    <figcaption>Grid item 3</figcaption>
  </figure>
  <figure>
    <img src="/theholmespage2000/images/works/running-late/runninglate-title.webp">
    <figcaption>Grid item 4</figcaption>
  </figure>
</div>

---

## Star Wars Page Test

<div class="sw-page-shell">
  <div class="sw-page-bg">
    <div class="sw-page-card">
      <h3>Starfield Test Section</h3>
      <p>This shows how content appears on themed pages like Path of the Jedi.</p>
    </div>
  </div>
</div>

---

## Closing

This page exists mainly for CSS testing. It’s handy to have one place that shows every Markdown element the site supports.