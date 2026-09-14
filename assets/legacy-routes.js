(() => {
const routes = {
  "works/humanimals.md": "/works/humanimals/",
  "works/my-friend-paul.md": "/works/my-friend-paul/",
  "works/on-ornithology.md": "/works/on-ornithology/",
  "works/running-late.md": "/works/running-late/",
  "works/zeman.md": "/works/zeman/",
  "pages/pathofthejedi.md": "/pages/pathofthejedi/",
  "pages/podcasts.md": "/pages/podcasts/",
  "blog/css.md": "/blog/css/",
  "blog/my-new-website.md": "/blog/my-new-website/",
  "blog/pathofthejedi.md": "/pages/pathofthejedi/",
  "hidden/yesno.md": "/hidden/yesno/",
  "food/posts/about.md": "/food/posts/about/",
  "food/posts/aeroplane-jelly-grape.md": "/food/posts/aeroplane-jelly-grape/",
  "food/posts/bourbon-fettuccine-grape.md": "/food/posts/bourbon-fettuccine-grape/",
  "food/posts/editorial-standards.md": "/food/posts/editorial-standards/",
  "food/posts/fujiya-peco-grape.md": "/food/posts/fujiya-peco-grape/",
  "food/posts/hi-chew-grape.md": "/food/posts/hi-chew-grape/",
  "food/posts/method.md": "/food/posts/method/",
  "food/posts/mikakuto-sakeru-grape.md": "/food/posts/mikakuto-sakeru-grape/",
  "food/posts/peelerz-grape.md": "/food/posts/peelerz-grape/"
};
const params = new URLSearchParams(location.search);
const post = params.get('post');
const key = location.pathname.startsWith('/food/') && post?.startsWith('posts/') ? 'food/' + post : post;
const target = routes[key] || (location.pathname === '/food/' && params.has('reviews') ? '/food/reviews/' : null);
if (target) location.replace(target + location.hash);
})();
