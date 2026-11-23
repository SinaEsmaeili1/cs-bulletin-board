// Board page (index.html): shows the notices, the title search, and the empty and
// no-results messages. User text is only ever added with textContent.

(() => {

  const params = new URLSearchParams(location.search);


  // index.html?reset forgets every posted notice and shows the plain board again.
  if (params.has('reset')) {
    Notices.reset();
    location.replace('index.html');
    return;
  }


  // Elements on the page. This script finds them by id, so keep the ids in index.html unchanged.
  const input = document.getElementById('q');
  const clearButton = document.getElementById('clear-search');
  const statusText = document.getElementById('board-status');
  const noResults = document.getElementById('no-results');
  const noResultsQuery = document.getElementById('no-results-query');
  const noResultsClear = document.getElementById('no-results-clear');
  const emptyBoard = document.getElementById('empty-board');
  const list = document.getElementById('announcement-list');


  // The search the board is showing, read from the address bar (for example index.html?q=club).
  // The search form puts it there when Search is pressed. '' means no search.
  const query = (params.get('q') || '').trim();

  // The clear button shows when the box has text or a search is applied.
  function updateClearButton() {
    clearButton.hidden = input.value === '' && query === '';
  }

  // Clears the search. With a search applied, the plain board is loaded again.
  // With only typed text, the box is emptied and keeps the focus.
  function clearSearch() {
    if (query) {
      location.href = 'index.html';
      return;
    }

    input.value = '';
    updateClearButton();
    input.focus();
  }


  // '6 announcements', '1 title matches “hack”', '2 titles match “club”'.
  function countMessage(count) {
    if (!query) return count === 1 ? '1 announcement' : `${count} announcements`;
    if (count === 1) return `1 title matches “${query}”`;
    return `${count} titles match “${query}”`;
  }

  // Shows the list, or the right message when there is nothing to list.
  function showResults(items) {
    if (items.length > 0) {

      while (list.firstChild) list.removeChild(list.firstChild);
      items.forEach((item) => list.appendChild(buildCard(item)));
      list.hidden = false;
      statusText.textContent = countMessage(items.length);

    } else if (query) {

      noResultsQuery.textContent = query;
      noResults.hidden = false;
      statusText.textContent = 'No matching titles';

    } else {

      emptyBoard.hidden = false;
      statusText.textContent = 'No announcements yet';

    }
  }


  // Creates a DOM element with an optional class.
  function el(tag, className = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  // Creates an element and sets its text (textContent is safe for user text).
  function textEl(tag, className, text) {
    const node = el(tag, className);
    node.textContent = text;
    return node;
  }

  // Builds one announcement card. Every value goes in with textContent.
  function buildCard(item) {
    const li = el('li', 'card-grid__item');
    const card = el('article', 'card');

    const meta = el('div', 'card__meta');
    meta.append(textEl('span', 'chip', item.category));
    if (item.isDemo) meta.append(textEl('span', 'card__demo', 'Demo notice'));

    // The title link is the "stretched link": its ::after covers the whole card (see CSS).
    // It carries the search along, so the details page can link back to the same results.
    const heading = el('h2', 'card__title');
    const titleLink = textEl('a', '', item.title);
    titleLink.href = 'details.html?id=' + item.id + (query ? '&q=' + encodeURIComponent(query) : '');
    heading.append(titleLink);

    const preview = textEl('p', 'card__preview', item.description);

    const footer = el('p', 'card__footer');

    const posted = el('span');
    const time = el('time');
    time.setAttribute('datetime', item.createdAt);
    time.textContent = Notices.formatDate(item.createdAt);
    posted.append('Posted ', time);

    const more = textEl('span', 'card__more', 'View details →');
    more.setAttribute('aria-hidden', 'true'); // the title link already says what the card does

    footer.append(posted, more);

    card.append(meta, heading, preview, footer);
    li.append(card);
    return li;
  }


  input.addEventListener('input', updateClearButton);
  clearButton.addEventListener('click', clearSearch);
  noResultsClear.addEventListener('click', clearSearch);

  input.value = query;
  updateClearButton();
  showResults(Notices.list(query));

})();
