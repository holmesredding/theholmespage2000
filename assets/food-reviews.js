(() => {
  const list = document.getElementById('article-list');
  const items = [...list.children];
  const tags = [...new Set(items.flatMap(item => JSON.parse(item.dataset.tags)))].sort();
  const filters = document.getElementById('tag-filters');
  let activeTag = null, sort = 'date', ascending = false, query = '';
  function render() {
    const ordered = [...items].sort((a, b) => {
      const comparison = sort === 'date' ? a.dataset.date.localeCompare(b.dataset.date) : Number(a.dataset.satisfaction) - Number(b.dataset.satisfaction);
      return ascending ? comparison : -comparison;
    });
    let visible = 0;
    ordered.forEach(item => {
      item.hidden = !(item.dataset.search.includes(query) && (!activeTag || JSON.parse(item.dataset.tags).includes(activeTag)));
      if (!item.hidden) visible++;
      list.append(item);
    });
    document.getElementById('no-results').style.display = visible ? 'none' : 'block';
    document.getElementById('list-heading').textContent = `Reviews by ${sort === 'date' ? 'Date' : 'Satisfaction'} ${ascending ? '↑' : '↓'}`;
    document.querySelectorAll('.sort-btn').forEach(button => {
      const selected = button.dataset.sort === sort;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('.sort-arrow').textContent = selected && ascending ? '↑' : '↓';
    });
  }
  tags.forEach(tag => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'tag-btn'; button.textContent = tag;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      activeTag = activeTag === tag ? null : tag;
      [...filters.children].forEach(item => {
        item.classList.toggle('active', item.textContent === activeTag);
        item.setAttribute('aria-pressed', String(item.textContent === activeTag));
      });
      render();
    });
    filters.append(button);
  });
  document.querySelectorAll('.sort-btn').forEach(button => button.addEventListener('click', () => {
    ascending = sort === button.dataset.sort ? !ascending : false;
    sort = button.dataset.sort; render();
  }));
  document.getElementById('search-input').addEventListener('input', event => { query = event.target.value.trim().toLowerCase(); render(); });
  document.querySelector('.controls').hidden = false;
  render();
})();
