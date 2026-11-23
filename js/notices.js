// The notices and where they are kept. Every page loads this file first.
// This version has no server: the six demo notices below start the board, and a posted
// notice is saved in this browser's local storage, so it is still there after a reload.

const Notices = (() => {

  // The whole list is saved under this one local storage key, as JSON.
  const STORAGE_KEY = 'cs-bulletin-board.notices';


  // Demo notices for a fresh board. They are fictional.
  const DEMO_NOTICES = [

    {
      id: 1,
      title: 'Free CSCI 1110 Java help — drop in',
      category: 'Tutoring',
      description:
        'Stuck on loops, arrays or your first class design? Senior students run drop-in help every Tuesday and Thursday afternoon. Bring your code and your questions; no appointment needed.\n' +
        '\n' +
        'When: Tuesdays and Thursdays, 2:30–4:30 pm (demo times)\n' +
        'Where: CS building, Learning Centre (demo location)',
      contact: 'java-help-demo@example.com',
      eventUrl: null,
      createdAt: '2026-11-18T15:00:00.000Z',
      isDemo: true,
    },

    {
      id: 2,
      title: 'Hack Night: build a command-line tool in three hours',
      category: 'Events',
      description:
        'Bring a laptop and an idea for a small command-line tool. We’ll start with a 15-minute walkthrough of argument parsing, then you’ll have three hours to build something that runs.\n' +
        '\n' +
        'You can work alone or in pairs. Snacks provided.\n' +
        '\n' +
        'When: Friday, 6–9 pm (demo date)\n' +
        'Where: CS building, Room 127 (demo location)',
      contact: 'hacknight-demo@example.com',
      eventUrl: 'https://example.com/hack-night',
      createdAt: '2026-11-17T15:00:00.000Z',
      isDemo: true,
    },

    {
      id: 3,
      title: 'Competitive Programming Club — weekly practice',
      category: 'Clubs',
      description:
        'We solve two or three contest problems together each week and talk through approaches afterwards. All levels welcome, including people who have never entered a contest.\n' +
        '\n' +
        'When: Wednesdays, 5:30 pm (demo time)\n' +
        'Where: CS building, Room 430 (demo location)',
      contact: 'Competitive Programming Club (demo) — cp-club-demo@example.com',
      eventUrl: 'https://example.com/cp-club',
      createdAt: '2026-11-16T15:00:00.000Z',
      isDemo: true,
    },

    {
      id: 4,
      title: 'Summer research assistant — systems lab',
      category: 'Opportunities',
      description:
        'A faculty-led lab is looking for an undergraduate research assistant for the summer term. Interest in operating systems or performance measurement is an asset.\n' +
        '\n' +
        'To apply, send a short note about your interests and an unofficial transcript. This is a demo posting; the position is fictional.',
      contact: 'systems-lab-demo@example.com',
      eventUrl: null,
      createdAt: '2026-11-15T15:00:00.000Z',
      isDemo: true,
    },

    {
      id: 5,
      title: 'Discrete math study group',
      category: 'Tutoring',
      description:
        'A peer-run study group working through practice problems on proofs, sets and counting. We meet weekly and share notes afterwards.\n' +
        '\n' +
        'When: Mondays, 4 pm (demo time)\n' +
        'Where: CS building, second-floor study area (demo location)',
      contact: null,
      eventUrl: null,
      createdAt: '2026-11-14T15:00:00.000Z',
      isDemo: true,
    },

    {
      id: 6,
      title: 'Résumé review drop-in for CS students',
      category: 'Events',
      description:
        'Upper-year students and alumni volunteers review résumés for co-op and internship applications. Bring a printed or digital copy.\n' +
        '\n' +
        'When: Thursday, 12–2 pm (demo date)\n' +
        'Where: CS building atrium (demo location)',
      contact: null,
      eventUrl: 'https://example.com/resume-review',
      createdAt: '2026-11-12T15:00:00.000Z',
      isDemo: true,
    },

  ];


  // One formatter, created once. Output looks like 'Nov 18, 2026'.
  const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Turns an ISO date string into text. Returns '' when the date is not valid.
  function formatDate(iso) {
    if (typeof iso !== 'string') return '';

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';

    return dateFormat.format(date);
  }


  // Reads the saved list. A browser with nothing saved yet starts from the demo notices.
  function readAll() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch {
      // Storage is blocked, or the saved value is not valid JSON: use the demo notices.
    }

    return DEMO_NOTICES.map((notice) => ({ ...notice }));
  }

  // Returns every notice, newest first. A non-empty query keeps only the titles
  // that contain it, ignoring case.
  function list(query = '') {
    const all = readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);

    const search = query.trim().toLowerCase();
    if (search === '') return all;

    return all.filter((notice) => notice.title.toLowerCase().includes(search));
  }

  // Returns one notice, or null when there is none with that id.
  function get(id) {
    return readAll().find((notice) => notice.id === id) ?? null;
  }


  // Saves a checked notice and returns it with its new id and posted time.
  // Throws when the browser refuses to save, so the form can say that nothing was posted.
  function add(value) {
    const all = readAll();

    const notice = {
      id: Math.max(0, ...all.map((saved) => saved.id)) + 1,
      title: value.title,
      category: value.category,
      description: value.description,
      contact: value.contact ?? null,
      eventUrl: value.eventUrl ?? null,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    all.push(notice);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return notice;
  }

  // Forgets every posted notice, so the board shows only the demo notices again.
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is blocked, so nothing was saved in the first place.
    }
  }


  return { list, get, add, reset, formatDate };

})();
