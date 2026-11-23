// Validation rules for a bulletin board announcement.
// The post form loads this file before post.js and calls validateAnnouncement.


const CATEGORIES = ['Tutoring', 'Clubs', 'Events', 'Opportunities'];

// Maximum lengths, counted as JavaScript string lengths AFTER cleaning.
const LIMITS = { title: 120, description: 2000, contact: 200, eventUrl: 500 };


const MESSAGES = {
  titleRequired: 'Enter a title. Spaces alone don’t count.',
  titleTooLong: 'Shorten the title to 120 characters or fewer.',

  category: 'Choose a category: Tutoring, Clubs, Events or Opportunities.',

  descriptionRequired: 'Enter a description. Spaces alone don’t count.',
  descriptionTooLong: 'Shorten the description to 2,000 characters or fewer.',

  contactNotText: 'Enter contact information as plain text, or leave it blank.',
  contactTooLong: 'Shorten the contact information to 200 characters or fewer.',

  linkInvalid: 'Enter a link starting with http:// or https://, or leave it blank.',
  linkTooLong: 'Shorten the link to 500 characters or fewer.',
};


// Checks every field. `input` can be anything: a non-object is treated as an empty form.
// Returns { ok, errors, value }. `errors` has a key only for each field that failed.
function validateAnnouncement(input) {
  const notice = typeof input === 'object' && input !== null ? input : {};

  const results = {
    title: checkTitle(notice.title),
    category: checkCategory(notice.category),
    description: checkDescription(notice.description),
    contact: checkContact(notice.contact),
    eventUrl: checkEventUrl(notice.eventUrl),
  };

  const errors = {};
  const value = {};

  for (const field of Object.keys(results)) {
    if (results[field].error) {
      errors[field] = results[field].error;
      value[field] = null;
    } else {
      value[field] = results[field].value;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, value };
}


// Each check below returns { value } when the field is fine, or { error } with the message to show.

function checkTitle(raw) {
  const title = cleanLine(raw);

  if (title === '') return { error: MESSAGES.titleRequired };
  if (title.length > LIMITS.title) return { error: MESSAGES.titleTooLong };

  return { value: title };
}

function checkCategory(raw) {
  // Case-sensitive on purpose: 'tutoring' is not one of the four categories.
  if (!CATEGORIES.includes(raw)) return { error: MESSAGES.category };

  return { value: raw };
}

function checkDescription(raw) {
  const description = cleanParagraph(raw);

  if (description === '') return { error: MESSAGES.descriptionRequired };
  if (description.length > LIMITS.description) return { error: MESSAGES.descriptionTooLong };

  return { value: description };
}

function checkContact(raw) {
  // Optional field: leaving it out (or blank) is fine and is stored as null.
  if (raw === undefined || raw === null) return { value: null };
  if (typeof raw !== 'string') return { error: MESSAGES.contactNotText };

  const contact = cleanLine(raw);

  if (contact === '') return { value: null };
  if (contact.length > LIMITS.contact) return { error: MESSAGES.contactTooLong };

  return { value: contact };
}

function checkEventUrl(raw) {
  // Optional field: leaving it out (or blank) is fine and is stored as null.
  if (raw === undefined || raw === null) return { value: null };
  if (typeof raw !== 'string') return { error: MESSAGES.linkInvalid };

  const url = raw.trim();

  if (url === '') return { value: null };
  if (url.length > LIMITS.eventUrl) return { error: MESSAGES.linkTooLong };
  if (!isWebLink(url)) return { error: MESSAGES.linkInvalid };

  return { value: url };
}


// Trims the text and turns every run of whitespace (spaces, tabs, line breaks) into one space.
// Anything that is not text gives '' so the caller reports it as blank.
function cleanLine(raw) {
  if (typeof raw !== 'string') return '';

  return raw.replace(/\s+/g, ' ').trim();
}

// Like cleanLine, but keeps line breaks. Windows (\r\n) and old Mac (\r) breaks become \n.
function cleanParagraph(raw) {
  if (typeof raw !== 'string') return '';

  return raw.replace(/\r\n?/g, '\n').trim();
}


// True for a plain http or https link. The text must already be trimmed.
function isWebLink(text) {
  if (!/^https?:\/\//i.test(text)) return false;

  // No spaces and no control characters (\p{Cc}) anywhere in the link.
  if (/[\s\p{Cc}]/u.test(text)) return false;

  let url;
  try {
    url = new URL(text);
  } catch {
    return false;
  }

  return (
    (url.protocol === 'http:' || url.protocol === 'https:') &&
    url.hostname !== '' &&
    url.username === '' &&
    url.password === ''
  );
}
