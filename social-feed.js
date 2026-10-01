/* <social-feed> — homepage "Latest" section: a swipeable Instagram carousel
 * (from a Behold JSON feed) and curated LinkedIn post cards (from Pages CMS).
 *
 * Data comes from /social/feed.json, which Jekyll builds from
 * _data/social.yml (settings) and _linkedin/*.md (posts). Everything is
 * rendered with createElement/textContent — captions and excerpts are never
 * parsed as HTML — and only https:// or same-site URLs are used.
 *
 * Usage (index.html):
 *   <x-import component-from-global-scope="social-feed" from="./social-feed.js"
 *             data-config="social/feed.json"></x-import>
 */
(() => {
  if (customElements.get('social-feed')) return;

  const IN_BLUE = '#0A66C2';
  const ICON_PLAY = 'M8 5.14v13.72a1 1 0 0 0 1.52.85l10.6-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z';
  const ICON_STACK = 'M7 3h11a3 3 0 0 1 3 3v11h-2V6a1 1 0 0 0-1-1H7V3Zm-3 4h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z';
  const ICON_IN = 'M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z';
  const ICON_IG = 'M12 2.2c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 4.86a4.94 4.94 0 1 0 0 9.88 4.94 4.94 0 0 0 0-9.88Zm0 8.15a3.21 3.21 0 1 1 0-6.42 3.21 3.21 0 0 1 0 6.42Zm5.14-9.5a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z';

  const CSS = `
    :host { display: block; }
    :host([hidden]) { display: none; }
    * { box-sizing: border-box; }
    section { border-top: 1px solid var(--line, #E7E1D5); }
    /* content-box to line up with the other homepage sections */
    .wrap { box-sizing: content-box; max-width: 1200px; margin: 0 auto; padding: clamp(54px,7vw,100px) clamp(20px,5vw,52px); }
    .eyebrow { font-family: 'Spline Sans Mono', monospace; font-size: 11px; letter-spacing: .18em;
      text-transform: uppercase; color: var(--accent, #5B53C9); margin-bottom: 14px; }
    h2 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; margin: 0;
      font-size: clamp(2.1rem,4.4vw,3.6rem); line-height: 1; letter-spacing: -.01em; color: var(--ink, #181712); }
    .block { margin-top: clamp(36px,5vw,56px); }
    .bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
    .who { display: flex; align-items: center; gap: 10px; font-family: 'Hanken Grotesk', sans-serif;
      font-size: 15px; font-weight: 600; color: var(--ink, #181712); text-decoration: none; }
    .who:hover { opacity: .65; }
    .who span { font-weight: 400; color: var(--muted, #6B665B); }
    .badge { width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; flex: none; }
    .badge svg { width: 16px; height: 16px; fill: #fff; }
    .badge.ig { background: linear-gradient(45deg,#F9CE34 0%,#EE2A7B 50%,#6228D7 100%); }
    .badge.in { background: ${IN_BLUE}; }
    .nav { display: flex; gap: 8px; }
    .nav button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line, #D8D1C2);
      background: var(--bg, #FBFAF7); color: var(--ink, #181712); font-size: 17px; cursor: pointer;
      display: grid; place-items: center; transition: border-color .15s, opacity .15s; }
    .nav button:hover:not(:disabled) { border-color: var(--ink, #181712); }
    .nav button:disabled { opacity: .3; cursor: default; }
    @media (hover: none), (max-width: 640px) { .nav { display: none; } }

    .track { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory;
      overscroll-behavior-x: contain; scrollbar-width: none; padding: 2px 2px 6px; margin: 0 -2px;
      -webkit-overflow-scrolling: touch; }
    .track::-webkit-scrollbar { display: none; }
    .track:focus-visible { outline: 2px solid var(--accent, #5B53C9); outline-offset: 4px; border-radius: 8px; }
    @media (prefers-reduced-motion: no-preference) { .track { scroll-behavior: smooth; } }
    .track > * { scroll-snap-align: start; flex: none; }

    /* Instagram tiles — 9:16 for reels/short-form */
    .ig-tile { position: relative; width: clamp(168px, 44vw, 236px); aspect-ratio: 9 / 16; border-radius: 14px;
      overflow: hidden; background: var(--bg2, #F4EFE5); display: block; text-decoration: none; color: #fff;
      isolation: isolate; }
    .ig-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      transition: transform .5s cubic-bezier(.16,.84,.44,1); }
    .ig-tile:hover img { transform: scale(1.04); }
    .ig-tile::after { content: ''; position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,.66) 0%, rgba(0,0,0,0) 46%); }
    .ig-kind { position: absolute; top: 10px; right: 10px; z-index: 1; width: 30px; height: 30px; border-radius: 50%;
      background: rgba(0,0,0,.38); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      display: grid; place-items: center; }
    .ig-kind svg { width: 14px; height: 14px; fill: #fff; }
    .ig-cap { position: absolute; left: 12px; right: 12px; bottom: 12px; z-index: 1;
      font-family: 'Hanken Grotesk', sans-serif; font-size: 13px; line-height: 1.35;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
      text-shadow: 0 1px 2px rgba(0,0,0,.35); }
    .ig-more { width: clamp(168px, 44vw, 236px); aspect-ratio: 9 / 16; border-radius: 14px;
      border: 1px dashed var(--line, #D8D1C2); display: flex; flex-direction: column; gap: 12px;
      align-items: center; justify-content: center; text-align: center; padding: 20px; text-decoration: none;
      font-family: 'Hanken Grotesk', sans-serif; font-size: 14px; font-weight: 600; color: var(--ink, #181712); }
    .ig-more:hover { border-color: var(--ink, #181712); }

    /* LinkedIn cards */
    .li-card { width: min(372px, 84vw); background: #fff; border: 1px solid var(--line, #E7E1D5); border-radius: 12px;
      padding: 20px 20px 18px; display: flex; flex-direction: column; text-decoration: none; color: var(--ink, #181712);
      font-family: 'Hanken Grotesk', sans-serif; transition: border-color .15s, box-shadow .2s; }
    .li-card:hover { border-color: #CFC7B6; box-shadow: 0 10px 30px -14px rgba(24,23,18,.22); }
    .li-head { display: flex; align-items: center; gap: 11px; }
    .li-head img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; object-position: top;
      background: var(--bg2, #F4EFE5); flex: none; }
    .li-name { font-size: 14.5px; font-weight: 600; line-height: 1.2; }
    .li-role { font-size: 12.5px; color: var(--muted, #6B665B); line-height: 1.3; margin-top: 2px; }
    .li-head .badge { margin-left: auto; width: 24px; height: 24px; border-radius: 5px; }
    .li-head .badge svg { width: 14px; height: 14px; }
    .li-date { font-family: 'Spline Sans Mono', monospace; font-size: 11px; color: var(--faint, #A39C8E);
      margin-top: 14px; letter-spacing: .04em; }
    .li-text { font-size: 15px; line-height: 1.58; color: #2B2923; margin: 8px 0 0; white-space: pre-line;
      display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
    .li-img { margin-top: 14px; aspect-ratio: 1.91 / 1; border-radius: 8px; overflow: hidden;
      border: 1px solid var(--line, #E7E1D5); background: var(--bg2, #F4EFE5); }
    .li-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .li-foot { margin-top: auto; padding-top: 16px; font-size: 13.5px; font-weight: 600; color: ${IN_BLUE}; }
    .li-card:hover .li-foot { text-decoration: underline; text-underline-offset: 3px; }
  `;

  // ── helpers ────────────────────────────────────────────────────────────
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) if (kid) n.append(kid);
    return n;
  }
  function icon(path) {
    const ns = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', path);
    s.append(p);
    return s;
  }
  // Only https URLs, or paths on this site. Anything else (javascript:, data:) is dropped.
  function safeUrl(u) {
    if (typeof u !== 'string' || !u.trim()) return null;
    try {
      const url = new URL(u.trim(), location.href);
      if (url.protocol === 'https:' || url.origin === location.origin) return url.href;
    } catch (_) {}
    return null;
  }
  const fmtDate = (d) => {
    const t = d ? new Date(d) : null;
    return t && !isNaN(t) ? t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  };
  const getJSON = (url) => fetch(url, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

  function carousel(label, items) {
    const track = el('div', { class: 'track', role: 'region', 'aria-label': label, tabindex: '0' }, items);
    const prev = el('button', { type: 'button', 'aria-label': 'Previous', text: '←' });
    const next = el('button', { type: 'button', 'aria-label': 'Next', text: '→' });
    const step = (dir) => track.scrollBy({ left: dir * Math.max(track.clientWidth * 0.8, 200) });
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    track.addEventListener('scroll', sync, { passive: true });
    new ResizeObserver(sync).observe(track);
    return { track, nav: el('div', { class: 'nav' }, prev, next) };
  }

  // ── blocks ─────────────────────────────────────────────────────────────
  function instagramBlock(feed, cfg) {
    const posts = (feed && Array.isArray(feed.posts) ? feed.posts : []).slice(0, cfg.instagram_max || 12);
    if (!posts.length) return null;
    const handle = feed.username || cfg.instagram_handle || '';
    const profile = safeUrl(cfg.instagram_url) || (handle ? 'https://www.instagram.com/' + encodeURIComponent(handle) + '/' : null);

    const tiles = posts.map((p) => {
      const href = safeUrl(p.permalink) || profile;
      const sz = p.sizes || {};
      const src = safeUrl((sz.medium && sz.medium.mediaUrl) || (sz.large && sz.large.mediaUrl) || p.thumbnailUrl || p.mediaUrl);
      if (!href || !src) return null;
      const isVideo = p.mediaType === 'VIDEO';
      const cap = (p.prunedCaption || p.caption || '').trim();
      return el('a', { class: 'ig-tile', href, target: '_blank', rel: 'noopener',
          'aria-label': (isVideo ? 'Reel' : 'Post') + (cap ? ': ' + cap.slice(0, 90) : '') + ' — opens Instagram' },
        el('img', { src, alt: p.altText || '', loading: 'lazy', decoding: 'async' }),
        (isVideo || p.mediaType === 'CAROUSEL_ALBUM') && el('span', { class: 'ig-kind' }, icon(isVideo ? ICON_PLAY : ICON_STACK)),
        cap && el('span', { class: 'ig-cap', text: cap }));
    }).filter(Boolean);
    if (!tiles.length) return null;
    if (profile) {
      tiles.push(el('a', { class: 'ig-more', href: profile, target: '_blank', rel: 'noopener' },
        el('span', { class: 'badge ig' }, icon(ICON_IG)), 'More on Instagram ↗'));
    }
    const c = carousel('Instagram posts', tiles);
    return el('div', { class: 'block' },
      el('div', { class: 'bar' },
        el('a', { class: 'who', href: profile, target: '_blank', rel: 'noopener' },
          el('span', { class: 'badge ig' }, icon(ICON_IG)), 'Instagram',
          handle && el('span', { text: '@' + handle })),
        c.nav),
      c.track);
  }

  function linkedinBlock(cfg) {
    const posts = Array.isArray(cfg.linkedin) ? cfg.linkedin : [];
    const profile = safeUrl(cfg.linkedin_url);
    const avatar = safeUrl(cfg.avatar || 'assets/raks-profile.png');
    const cards = posts.map((p) => {
      const href = safeUrl(p.url);
      if (!href || !p.excerpt) return null;
      const img = safeUrl(p.image);
      return el('a', { class: 'li-card', href, target: '_blank', rel: 'noopener' },
        el('div', { class: 'li-head' },
          avatar && el('img', { src: avatar, alt: '', loading: 'lazy' }),
          el('div', {},
            el('div', { class: 'li-name', text: cfg.name || 'Rakshith Bangalore' }),
            el('div', { class: 'li-role', text: cfg.headline || '' })),
          el('span', { class: 'badge in' }, icon(ICON_IN))),
        fmtDate(p.date) && el('div', { class: 'li-date', text: fmtDate(p.date) }),
        el('p', { class: 'li-text', text: p.excerpt }),
        img && el('div', { class: 'li-img' }, el('img', { src: img, alt: '', loading: 'lazy' })),
        el('div', { class: 'li-foot', text: 'Read on LinkedIn →' }));
    }).filter(Boolean);
    if (!cards.length) return null;
    const c = carousel('LinkedIn posts', cards);
    return el('div', { class: 'block' },
      el('div', { class: 'bar' },
        el('a', { class: 'who', href: profile, target: '_blank', rel: 'noopener' },
          el('span', { class: 'badge in' }, icon(ICON_IN)), 'LinkedIn',
          el('span', { text: 'Follow ↗' })),
        c.nav),
      c.track);
  }

  // ── element ────────────────────────────────────────────────────────────
  class SocialFeed extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      this.hidden = true; // stays hidden until there is something to show
      this._root = this.attachShadow({ mode: 'open' });
      this.load();
    }
    async load() {
      const cfgUrl = this.getAttribute('data-config') || 'social/feed.json';
      const cfg = (await getJSON(cfgUrl)) || {};
      const igUrl = safeUrl(cfg.instagram_feed_url);
      const ig = igUrl ? await getJSON(igUrl) : null;
      const blocks = [instagramBlock(ig, cfg), linkedinBlock(cfg)].filter(Boolean);
      if (!blocks.length) return;
      this._root.replaceChildren(
        el('style', { text: CSS }),
        el('section', { 'aria-labelledby': 'social-h' },
          el('div', { class: 'wrap' },
            el('div', { class: 'eyebrow', text: cfg.eyebrow || 'Latest' }),
            el('h2', { id: 'social-h', text: cfg.heading || 'From the feed.' }),
            blocks)));
      this.hidden = false;
    }
  }
  customElements.define('social-feed', SocialFeed);
})();
