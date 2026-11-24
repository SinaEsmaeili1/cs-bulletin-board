// Details page (details.html?id=<id>): shows one announcement.
// User text is only ever added with textContent.

(() => {

  const params = new URLSearchParams(location.search);


  // Elements on the page. This script finds them by id, so keep the ids in details.html unchanged.
  const backLink = document.getElementById('back-link');
  const backLinkText = document.getElementById('back-link-text');
  const notFound = document.getElementById('not-found');
  const article = document.getElementById('details');

  const categoryEl = document.getElementById('details-category');
  const dateEl = document.getElementById('details-date');
  const titleEl = document.getElementById('details-title');
  const descriptionEl = document.getElementById('details-description');

  const extraList = document.getElementById('details-extra');
  const contactRow = document.getElementById('details-contact-row');
  const contactEl = document.getElementById('details-contact');
  const linkRow = document.getElementById('details-link-row');
  const linkEl = document.getElementById('details-link');


  function showNotFound() {
    notFound.hidden = false;
    document.title = 'Announcement not found | CS Bulletin Board';
  }


  // True only for a string with some visible text. Null and blank values count as "not supplied".
  function hasText(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  // Only http and https addresses become a clickable link. Anything else is shown as plain text.
  function showEventLink(value) {
    if (/^https?:\/\//i.test(value)) {
      linkEl.href = value;
      linkEl.textContent = value;
    } else {
      linkEl.replaceWith(document.createTextNode(value));
    }
  }

  // Fills the page with one announcement and shows it.
  function showAnnouncement(announcement) {
    categoryEl.textContent = announcement.category;
    dateEl.setAttribute('datetime', announcement.createdAt);
    dateEl.textContent = Notices.formatDate(announcement.createdAt);

    titleEl.textContent = announcement.title;
    descriptionEl.textContent = announcement.description; // CSS keeps the line breaks

    // The Contact and Event link rows appear only when the announcement has them.
    const hasContact = hasText(announcement.contact);
    const hasLink = hasText(announcement.eventUrl);

    contactRow.hidden = !hasContact;
    if (hasContact) contactEl.textContent = announcement.contact;

    linkRow.hidden = !hasLink;
    if (hasLink) showEventLink(announcement.eventUrl);

    // The whole list is hidden when neither row is shown, so no empty heading is left behind.
    extraList.hidden = !hasContact && !hasLink;

    article.hidden = false;
    document.title = announcement.title + ' | CS Bulletin Board';
  }


  // Back link: a visitor who came from a search on the board goes back to that search.
  const query = (params.get('q') || '').trim();

  if (query) {
    backLink.href = 'index.html?q=' + encodeURIComponent(query);
    backLinkText.textContent = 'Back to search results';
  }


  // The id comes from the address. Ids are whole numbers from 1 up, with no leading zero.
  const idText = params.get('id') || '';
  const announcement = /^[1-9][0-9]{0,14}$/.test(idText) ? Notices.get(Number(idText)) : null;

  if (announcement) {
    showAnnouncement(announcement);
  } else {
    showNotFound();
  }

})();
