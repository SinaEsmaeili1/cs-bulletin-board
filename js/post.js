// Post an announcement page (post.html).
// The form is checked with the rules in validation.js, then saved with Notices.add.
// The page shows either the errors or the success panel.

(() => {

  // The five fields, in the order they appear on the form.
  // name is both the control's id and its name.
  const FIELDS = [
    { name: 'title', label: 'Title' },
    { name: 'category', label: 'Category' },
    { name: 'description', label: 'Description' },
    { name: 'contact', label: 'Contact information' },
    { name: 'eventUrl', label: 'Event link' },
  ];

  function byId(id) {
    return document.getElementById(id);
  }


  // Shows the error for each field that has one, and clears the others.
  // errors is an object such as { title: '...' }.
  function showErrors(errors) {
    for (const { name } of FIELDS) {
      const message = errors[name];
      const control = byId(name);
      const field = byId('field-' + name);

      if (message) {

        byId(name + '-error-text').textContent = message;
        byId(name + '-error').hidden = false;
        control.setAttribute('aria-invalid', 'true');
        field.classList.add('field--invalid');

      } else {

        byId(name + '-error-text').textContent = '';
        byId(name + '-error').hidden = true;
        control.removeAttribute('aria-invalid');
        field.classList.remove('field--invalid');

      }
    }

    showSummary(errors);
  }

  // Fills the error summary above the fields: one link per error, in field order.
  // With no errors, the summary is hidden and its list is emptied.
  function showSummary(errors) {
    const summary = byId('error-summary');
    const list = byId('error-summary-list');
    const problems = FIELDS.filter(({ name }) => errors[name]);

    list.replaceChildren();

    if (problems.length === 0) {
      summary.hidden = true;
      return;
    }

    byId('error-summary-heading').textContent =
      problems.length === 1 ? 'Fix 1 problem before posting' : `Fix ${problems.length} problems before posting`;

    for (const { name, label } of problems) {
      const link = document.createElement('a');
      link.href = '#' + name;
      link.textContent = `${label}: ${errors[name]}`;

      // Clicking the link moves keyboard focus into the field.
      link.addEventListener('click', (event) => {
        event.preventDefault();
        byId(name).focus();
      });

      const item = document.createElement('li');
      item.append(link);
      list.append(item);
    }

    summary.hidden = false;
  }

  // Clears every field error and hides the red box for a failed save.
  function clearErrors() {
    showErrors({});
    byId('save-error').hidden = true;
  }


  // Shows the red box for a failed save and moves focus to it.
  // The entries in the form are never cleared here.
  function showSaveError() {
    byId('save-error-title').textContent = 'We couldn’t save your announcement';
    byId('save-error-text').textContent = 'Nothing was posted, and your entries are still here. Please try again.';

    byId('save-error').hidden = false;
    byId('save-error').focus();
  }


  // Shows the saved announcement: the success panel replaces the form.
  function showSuccess(announcement) {
    byId('success-title').textContent = announcement.title;
    byId('view-announcement').href = 'details.html?id=' + announcement.id;

    byId('post-form').hidden = true;
    byId('success-panel').hidden = false;

    document.title = 'Announcement posted – CS Bulletin Board';
    byId('success-heading').focus();
  }

  // "Post another": an empty form, and focus in the title box.
  function postAnother() {
    byId('post-form').reset();
    clearErrors();

    byId('success-panel').hidden = true;
    byId('post-form').hidden = false;

    document.title = 'Post an announcement – CS Bulletin Board';
    byId('title').focus();
  }


  function handleSubmit(event) {
    event.preventDefault();

    // Read the raw values. Only the check changes them (trimming and so on).
    const result = validateAnnouncement({
      title: byId('title').value,
      category: byId('category').value,
      description: byId('description').value,
      contact: byId('contact').value,
      eventUrl: byId('eventUrl').value,
    });

    if (!result.ok) {
      byId('save-error').hidden = true;
      showErrors(result.errors);
      byId('error-summary').focus();
      return;
    }

    clearErrors();

    // The post counts as saved only when the browser has stored it.
    let announcement;
    try {
      announcement = Notices.add(result.value);
    } catch {
      showSaveError();
      return;
    }

    showSuccess(announcement);
  }


  byId('post-form').addEventListener('submit', handleSubmit);
  byId('post-another').addEventListener('click', postAnother);

})();
