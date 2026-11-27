const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const narrow = window.matchMedia('(max-width: 760px)');
const compactNav = window.matchMedia('(max-width: 920px)');
const english = document.documentElement.lang === 'en';
const words = english ? {
  filterCount: count => `Showing ${count} ${count === 1 ? 'project' : 'projects'}.`,
  badgeFront: 'Drag to move · Click to flip',
  badgeBack: 'Drag to move · Click to return',
  emailCopied: 'Email copied',
  emailStatus: 'The email address was copied.',
  emailFailed: 'Select the email address above to copy it.',
  projectDetails: title => 'View details for ' + title,
  projectStatus: (index, count, title) => `Project ${index} of ${count}, ${title}`,
  experienceStatus: (index, count, title) => `Role ${index} of ${count}, ${title}`
} : {
  filterCount: count => `Hiển thị ${count} dự án.`,
  badgeFront: 'Kéo để di chuyển · Bấm để lật thẻ',
  badgeBack: 'Kéo để di chuyển · Bấm để xem mặt trước',
  emailCopied: 'Đã sao chép email',
  emailStatus: 'Đã sao chép địa chỉ email.',
  emailFailed: 'Chọn địa chỉ email ở trên để sao chép.',
  projectDetails: title => 'Xem chi tiết ' + title,
  projectStatus: (index, count, title) => `Dự án ${index} trên ${count}, ${title}`,
  experienceStatus: (index, count, title) => `Mốc ${index} trên ${count}, ${title}`
};

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

// Damp visual progress using elapsed time, while preserving native scrolling.
let motionScrollY = window.scrollY;
let motionLastTime = 0;
const motionRegions = new WeakMap();
const motionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) {
    const region = motionRegions.get(entry.target);
    region.active = entry.isIntersecting;
    entry.target.dataset.motionRegion = region.active ? 'active' : 'idle';
  }
  queueScrollUpdate();
}, { rootMargin: '35% 0px' }) : null;

function observeMotionRegion(element) {
  if (motionRegions.has(element)) return motionRegions.get(element);
  const bounds = element.getBoundingClientRect();
  const region = { active: !motionObserver || (bounds.bottom > -innerHeight * .35 && bounds.top < innerHeight * 1.35) };
  motionRegions.set(element, region);
  element.dataset.motionRegion = region.active ? 'active' : 'idle';
  motionObserver?.observe(element);
  return region;
}

function visibleMotion(element, update) {
  const region = observeMotionRegion(element);
  return () => { if (region.active) update(); };
}

function motionRect(element) {
  const bounds = element.getBoundingClientRect();
  const offset = window.scrollY - motionScrollY;
  return { top: bounds.top + offset, bottom: bounds.bottom + offset, height: bounds.height };
}

const navigation = document.querySelector('#main-nav');
const navButton = document.querySelector('.nav-toggle');
const header = document.querySelector('.topbar');
const languages = [...document.querySelectorAll('.language-switch a')];
languages.forEach(link => link.addEventListener('click', () => {
  try { localStorage.setItem('portfolio-language', link.getAttribute('hreflang')); } catch (error) { /* Navigation still works without storage. */ }
}));
header.dataset.menuReady = '';

// Refract the page behind the navigation without distorting its controls.
const svgNS = 'http://www.w3.org/2000/svg';
const glassSvg = document.createElementNS(svgNS, 'svg');
glassSvg.setAttribute('class', 'glass-filter');
glassSvg.setAttribute('aria-hidden', 'true');
glassSvg.setAttribute('focusable', 'false');
glassSvg.innerHTML = '<defs><filter id="liquid-refraction" x="-25%" y="-70%" width="150%" height="240%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.085" numOctaves="1" seed="6" result="water"/><feDisplacementMap in="SourceGraphic" in2="water" scale="24" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
header.prepend(glassSvg);
header.dataset.liquidReady = '';

// A moving highlight and small ripples make the glass respond to the pointer.
const glassWater = document.createElement('span');
glassWater.className = 'glass-water';
glassWater.setAttribute('aria-hidden', 'true');
header.prepend(glassWater);
let lastRipple = 0;
header.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !desktopPointer.matches || event.pointerType === 'touch') return;
  const rect = header.getBoundingClientRect();
  header.style.setProperty('--glass-x', (clamp((event.clientX - rect.left) / rect.width) * 100).toFixed(1) + '%');
  header.style.setProperty('--glass-y', (clamp((event.clientY - rect.top) / rect.height) * 100).toFixed(1) + '%');
  if (event.timeStamp - lastRipple < 130) return;
  lastRipple = event.timeStamp;
  const ripple = document.createElement('i');
  ripple.className = 'glass-ripple';
  ripple.style.left = (event.clientX - rect.left) + 'px';
  ripple.style.top = (event.clientY - rect.top) + 'px';
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  glassWater.append(ripple);
  while (glassWater.children.length > 7) glassWater.firstElementChild.remove();
});
header.addEventListener('pointerleave', () => {
  header.style.removeProperty('--glass-x');
  header.style.removeProperty('--glass-y');
});

function setMenu(open) {
  navButton.setAttribute('aria-expanded', String(open));
  navigation.hidden = compactNav.matches && !open;
}

function updateMenuLayout() {
  const toggleWasFocused = document.activeElement === navButton;
  navButton.hidden = !compactNav.matches;
  if (compactNav.matches && navigation.contains(document.activeElement)) navButton.focus();
  setMenu(false);
  if (!compactNav.matches && toggleWasFocused) {
    (navigation.querySelector('a[aria-current]:not(.nav-contact-mobile)') || header.querySelector('.site-contact')).focus();
  }
}

navButton.addEventListener('click', () => setMenu(navButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navButton.getAttribute('aria-expanded') === 'true'
    && !header.querySelector('.discovery-toggle[aria-expanded="true"]')) {
    setMenu(false);
    navButton.focus();
  }
});
document.addEventListener('pointerdown', event => {
  if (!header.contains(event.target) && navButton.getAttribute('aria-expanded') === 'true') setMenu(false);
});
navigation.addEventListener('click', event => {
  if (compactNav.matches && event.target.closest('a')) setMenu(false);
});
compactNav.addEventListener('change', updateMenuLayout);
updateMenuLayout();

function syncLanguageLinks() {
  languages.forEach(link => {
    const url = new URL(link.href);
    url.hash = window.location.hash;
    link.href = url.href;
  });
}
window.addEventListener('hashchange', syncLanguageLinks);
syncLanguageLinks();

// Keep the full list accessible while the visible specialty gently types itself.
for (const typewriter of document.querySelectorAll('[data-typewriter]')) {
  const specialties = typewriter.dataset.words.split('|').filter(Boolean);
  let wordIndex = 0;
  let letterIndex = specialties[0].length;
  let erasing = true;
  let timer;

  function typeNext() {
    if (document.hidden || reducedMotion.matches) return;
    const word = specialties[wordIndex];
    letterIndex += erasing ? -1 : 1;
    typewriter.textContent = word.slice(0, letterIndex);
    let delay = erasing ? 38 : 82;
    if (letterIndex === 0) {
      wordIndex = (wordIndex + 1) % specialties.length;
      erasing = false;
      delay = 280;
    } else if (letterIndex === word.length && !erasing) {
      erasing = true;
      delay = 2100;
    }
    timer = setTimeout(typeNext, delay);
  }

  function updateTyping() {
    clearTimeout(timer);
    if (reducedMotion.matches) {
      typewriter.textContent = specialties[0];
      wordIndex = 0;
      letterIndex = specialties[0].length;
      erasing = true;
    } else if (!document.hidden) timer = setTimeout(typeNext, 2100);
  }
  document.addEventListener('visibilitychange', updateTyping);
  reducedMotion.addEventListener('change', updateTyping);
  updateTyping();
}

for (const canvas of document.querySelectorAll('[data-stars]')) {
  const context = canvas.getContext('2d');
  if (!context) continue;

  function drawStars() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = Math.round(clamp(width * height / 3500, 116, 288));
    let seed = 50261;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i += 1) {
      const x = random() * width;
      const y = random() * height;
      const brightness = random();
      const radius = .4 + brightness ** 3 * 1.08;
      context.globalAlpha = .17 + brightness * .61;
      context.fillStyle = i % 4 === 0 ? '#b5baff' : '#f7f1ff';
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      if (brightness < .975) continue;
      const halo = context.createRadialGradient(x, y, .4, x, y, 7);
      halo.addColorStop(0, '#e4d6ff98');
      halo.addColorStop(1, '#ac8eff00');
      context.fillStyle = halo;
      context.fillRect(x - 7, y - 7, 14, 14);
    }
  }

  if ('ResizeObserver' in window) new ResizeObserver(drawStars).observe(canvas);
  else window.addEventListener('resize', drawStars);
  drawStars();
}

const filters = document.querySelector('.filters');
if (filters) {
  const buttons = [...filters.querySelectorAll('button')];
  const projects = [...document.querySelectorAll('.project[data-category]')];
  const status = document.querySelector('#filter-status');

  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const category = button.dataset.filter;
    let visible = 0;
    for (const project of projects) {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) visible += 1;
    }
    buttons.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    status.textContent = words.filterCount(visible);
    queueScrollUpdate();
  });
  filters.hidden = false;
}

const badgeToggle = document.querySelector('[data-badge-toggle]');
if (badgeToggle) {
  const badge = badgeToggle.closest('.badge-holder');
  const swing = badge.closest('.badge-swing') || badge;
  const front = badge.querySelector('[data-badge-front]');
  const back = badge.querySelector('[data-badge-back]');
  const hint = badge.querySelector('#badge-hint');
  const scene = badge.closest('.portrait-scene');
  let drag = null;
  let moved = false;
  let suppressClick = false;
  let settleFrame = 0;
  let offsetX = 0;
  let offsetY = 0;
  let entrancePlayed = false;
  let badgeInteracted = false;
  let entranceObserver = null;

  function paintBadge() {
    badge.style.setProperty('--drag-x', offsetX + 'px');
    badge.style.setProperty('--drag-y', offsetY + 'px');
    badge.style.setProperty('--drag-angle', clamp(offsetX * .055, -12, 12) + 'deg');
  }

  function resetBadge() {
    cancelAnimationFrame(settleFrame);
    badge.classList.remove('is-settling', 'is-dragging');
    swing.classList.remove('is-held');
    offsetX = 0;
    offsetY = 0;
    paintBadge();
  }

  function settleBadge() {
    if (reducedMotion.matches) { resetBadge(); return; }
    badge.classList.add('is-settling');
    let velocityX = 0;
    let velocityY = 0;
    let lastTime = performance.now();
    function step(now) {
      const elapsed = Math.min((now - lastTime) / 16.667, 2);
      lastTime = now;
      velocityX = (velocityX - offsetX * .065 * elapsed) * Math.pow(.8, elapsed);
      velocityY = (velocityY - offsetY * .065 * elapsed) * Math.pow(.8, elapsed);
      offsetX += velocityX * elapsed;
      offsetY += velocityY * elapsed;
      paintBadge();
      if (Math.abs(offsetX) + Math.abs(offsetY) + Math.abs(velocityX) + Math.abs(velocityY) < .2) resetBadge();
      else settleFrame = requestAnimationFrame(step);
    }
    settleFrame = requestAnimationFrame(step);
  }

  function turnBadge(flipped) {
    badge.classList.toggle('is-flipped', flipped);
    badgeToggle.setAttribute('aria-pressed', String(flipped));
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    hint.textContent = flipped ? words.badgeBack : words.badgeFront;
  }

  function bounceOnReady() {
    if (reducedMotion.matches || drag || badgeInteracted || entrancePlayed) return;
    function beginSwing() {
      if (reducedMotion.matches || drag || badgeInteracted || entrancePlayed) return;
      entrancePlayed = true;
      swing.classList.add('is-intro-bouncing');
    }
    // On phones the portrait may begin below the viewport, so wait until it is visible.
    if ('IntersectionObserver' in window) {
      entranceObserver = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting || entries[0].intersectionRatio < .65) return;
        entranceObserver.disconnect();
        entranceObserver = null;
        beginSwing();
      }, { threshold: .65 });
      entranceObserver.observe(badge);
    } else beginSwing();
  }
  window.addEventListener('portfolio:ready', bounceOnReady, { once: true });
  swing.addEventListener('animationend', event => {
    if (event.animationName === 'badge-flick') swing.classList.remove('is-intro-bouncing');
  });
  badgeToggle.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    badgeInteracted = true;
    entranceObserver?.disconnect();
    entranceObserver = null;
    swing.classList.add('is-held');
    cancelAnimationFrame(settleFrame);
    badge.classList.remove('is-settling');
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, offsetX, offsetY };
    moved = false;
    suppressClick = false;
    badgeToggle.setPointerCapture(event.pointerId);
  });
  badgeToggle.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) < 6) return;
    moved = true;
    badge.classList.add('is-dragging');
    const limitX = Math.min(145, scene.clientWidth * .23);
    offsetX = clamp(drag.offsetX + dx, -limitX, limitX);
    offsetY = clamp(drag.offsetY + dy, -65, 100);
    paintBadge();
  });
  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    suppressClick = moved;
    drag = null;
    swing.classList.remove('is-held');
    badge.classList.remove('is-dragging');
    if (moved) settleBadge();
  }
  badgeToggle.addEventListener('pointerup', endDrag);
  badgeToggle.addEventListener('pointercancel', endDrag);
  badgeToggle.addEventListener('lostpointercapture', endDrag);
  badgeToggle.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) {
      suppressClick = false;
      return;
    }
    turnBadge(badgeToggle.getAttribute('aria-pressed') !== 'true');
  });
  badgeToggle.addEventListener('keydown', event => {
    if (event.key === 'Escape') turnBadge(false);
  });
  reducedMotion.addEventListener('change', () => {
    resetBadge();
    if (reducedMotion.matches) { entranceObserver?.disconnect(); swing.classList.remove('is-intro-bouncing'); }
  });
  window.addEventListener('resize', resetBadge);
  badgeToggle.hidden = false;
  hint.hidden = false;
}

const portrait = document.querySelector('#spider-card');
if (portrait) {
  let pinned = false;
  let preview = false;

  function showPortrait() {
    portrait.classList.toggle('is-transformed', pinned || preview);
    portrait.classList.toggle('is-pinned', pinned);
    portrait.setAttribute('aria-pressed', String(pinned));
  }

  function positionPortraitReveal(event) {
    const bounds = portrait.getBoundingClientRect();
    // The overlay image is scaled 1.13x around its center; map back into its space.
    const x = (clamp((event.clientX - bounds.left) / bounds.width) - .5) / 1.13 + .5;
    const y = (clamp((event.clientY - bounds.top) / bounds.height) - .5) / 1.13 + .5;
    portrait.style.setProperty('--reveal-x', (x * 100).toFixed(2) + '%');
    portrait.style.setProperty('--reveal-y', (y * 100).toFixed(2) + '%');
    if (!reducedMotion.matches) {
      const holder = portrait.closest('.portrait-toggle');
      holder.style.setProperty('--portrait-tilt-x', ((.5 - (event.clientY - bounds.top) / bounds.height) * 6).toFixed(2) + 'deg');
      holder.style.setProperty('--portrait-tilt-y', (((event.clientX - bounds.left) / bounds.width - .5) * 7).toFixed(2) + 'deg');
    }
  }

  portrait.addEventListener('pointerenter', event => {
    if (desktopPointer.matches && event.pointerType !== 'touch') {
      positionPortraitReveal(event);
      preview = true;
      showPortrait();
    }
  });
  portrait.addEventListener('pointermove', event => {
    if (desktopPointer.matches && event.pointerType !== 'touch') positionPortraitReveal(event);
  });
  portrait.addEventListener('pointerleave', () => {
    preview = false;
    showPortrait();
    portrait.closest('.portrait-toggle').style.removeProperty('--portrait-tilt-x');
    portrait.closest('.portrait-toggle').style.removeProperty('--portrait-tilt-y');
  });
  portrait.addEventListener('click', () => {
    pinned = !pinned;
    preview = false;
    showPortrait();
  });
  portrait.addEventListener('blur', () => {
    preview = false;
    showPortrait();
  });
  portrait.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      pinned = false;
      preview = false;
      showPortrait();
    }
  });
  portrait.disabled = false;
  const portraitHint = document.querySelector('#spider-hint');
  function updatePortraitHint() {
    portraitHint.textContent = desktopPointer.matches
      ? (english ? 'Move to explore · Click or press Enter to change the outfit' : 'Rê chuột để khám phá · Bấm hoặc nhấn Enter để đổi trang phục')
      : (english ? 'Tap the portrait to change the outfit' : 'Chạm vào chân dung để đổi trang phục');
  }
  desktopPointer.addEventListener('change', updatePortraitHint);
  updatePortraitHint();
  portraitHint.hidden = false;
}

const copyEmail = document.querySelector('[data-copy-email]');
if (copyEmail && navigator.clipboard?.writeText) {
  const status = document.querySelector('[data-copy-status]');
  const initialLabel = copyEmail.textContent;
  let reset;
  copyEmail.addEventListener('click', async () => {
    clearTimeout(reset);
    try {
      await navigator.clipboard.writeText(copyEmail.dataset.copyEmail);
      copyEmail.textContent = words.emailCopied;
      status.textContent = words.emailStatus;
      status.classList.add('sr');
      reset = setTimeout(() => { copyEmail.textContent = initialLabel; }, 2400);
    } catch {
      status.textContent = words.emailFailed;
      status.classList.remove('sr');
    }
  });
  copyEmail.hidden = false;
}

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('has-entered');
        reveal.unobserve(entry.target);
      }
    }
  }, { threshold: 0.13 });
  document.querySelectorAll('[data-reveal]').forEach(node => {
    if (node.getBoundingClientRect().top > window.innerHeight * 0.85) reveal.observe(node);
  });
}

for (const area of document.querySelectorAll('[data-glow]')) {
  let pointerFrame = 0;

  function clearLight() {
    cancelAnimationFrame(pointerFrame);
    for (const property of ['--light-x', '--light-y', '--light-opacity', '--badge-yaw', '--badge-pitch', '--portrait-shine']) {
      area.style.removeProperty(property);
    }
  }

  area.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !desktopPointer.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(pointerFrame);
    const { clientX, clientY } = event;
    pointerFrame = requestAnimationFrame(() => {
      const rect = area.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width);
      const y = clamp((clientY - rect.top) / rect.height);
      area.style.setProperty('--light-x', x * 100 + '%');
      area.style.setProperty('--light-y', y * 100 + '%');
      area.style.setProperty('--light-opacity', '1');
      if (area.dataset.glow === 'hero' && !narrow.matches) {
        area.style.setProperty('--badge-yaw', (-5 + 20 * (x - 0.5)) + 'deg');
        area.style.setProperty('--badge-pitch', (12 * (0.5 - y)) + 'deg');
        area.style.setProperty('--portrait-shine', (x * 160 - 80) + '%');
      }
    });
  });
  area.addEventListener('pointerleave', clearLight);
  reducedMotion.addEventListener('change', clearLight);
  desktopPointer.addEventListener('change', clearLight);
}

function smoothPhase(value, start, end) {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

function separateTitleLetters(assembly) {
  const scattered = [
    [-.32, .72, -18], [.37, -.52, 13], [.61, -.27, 17], [-.41, .66, -12],
    [.79, -.12, 12], [-.38, .44, -13], [-.44, -.36, 10], [.51, .63, -17],
    [.77, .42, 13], [-.81, -.62, -12], [.31, .37, 21], [-.33, -.53, -16]
  ];
  let index = 0;
  for (const row of assembly.querySelectorAll('[data-assemble-row]')) {
    const text = row.textContent.trim().normalize('NFC');
    const pieces = Array.from(text, character => {
      if (/\s/.test(character)) return document.createTextNode(character);
      const letter = document.createElement('span');
      const [x, y, angle] = scattered[index % scattered.length];
      letter.className = 'assembly-letter';
      letter.textContent = character;
      letter.style.setProperty('--scatter-x', x + 'em');
      letter.style.setProperty('--scatter-y', y + 'em');
      letter.style.setProperty('--scatter-angle', angle + 'deg');
      letter.style.setProperty('--letter-lag', String(1 + (index % 4) * .17));
      index += 1;
      return letter;
    });
    row.setAttribute('aria-hidden', 'true');
    row.replaceChildren(...pieces);
  }
}

function createShowcase(track) {
  const stage = track.querySelector('.showcase-stage');
  const assembly = track.querySelector('[data-assembly]');
  const assemblyTitle = assembly.querySelector('h2');
  const cue = track.querySelector('[data-assembly-cue]');
  const skip = track.querySelector('[data-open-showcase]');
  const frame = track.querySelector('.showcase-frame');
  const visual = track.querySelector('.deck-visual');
  const backgroundTitles = [...track.querySelectorAll('[data-deck-word]')];
  const cards = [...track.querySelectorAll('.deck-card')];
  const dots = [...track.querySelectorAll('[data-slide]')];
  const controls = track.querySelector('.deck-controls');
  const prev = controls.querySelector('[data-step="-1"]');
  const next = controls.querySelector('[data-step="1"]');
  const caption = track.querySelector('[data-deck-title]');
  const summary = track.querySelector('[data-deck-summary]');
  const tools = track.querySelector('[data-deck-tools]');
  const link = track.querySelector('[data-deck-link]');
  const count = track.querySelector('[data-deck-count]');
  const status = track.querySelector('[data-deck-status]');
  const sticky = window.matchMedia('(min-height: 555px) and (prefers-reduced-motion: no-preference)');

  const last = cards.length - 1;
  let position = 0;
  let selected = -1;
  let spacing = 60;
  let drop = 16;
  let stickyTop = 0;
  let introTravel = 0;
  let introZoom = 3;
  let slideTravel = 0;
  let lastIntro = -1;
  let focusAfterIntro = false;

  separateTitleLetters(assembly);

  function showCaption(index) {
    const project = cards[index].dataset;
    frame.dataset.tone = project.tone;
    caption.textContent = project.title;
    summary.textContent = project.summary;
    tools.textContent = project.tools;
    link.setAttribute('href', project.url);
    link.setAttribute('aria-label', words.projectDetails(project.title));
    count.textContent = (index + 1) + ' / ' + cards.length;
    prev.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === last));
    cards.forEach((card, i) => card.classList.toggle('is-active', i === index));
    dots.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function paint(value, force = false) {
    if (value === position && !force) return;
    position = value;
    backgroundTitles.forEach((title, index) => {
      const offset = index - position;
      const leaving = clamp(-offset);
      const arriving = clamp(offset);
      const style = title.style;
      style.setProperty('--word-opacity', String(1 - smoothPhase(Math.abs(offset), 0, 1)));
      style.setProperty('--word-slide', (arriving * 17 - leaving * 43) + 'vw');
      style.setProperty('--word-zoom', String(1 + leaving * .69 - arriving * .15));
      style.setProperty('--word-blur', leaving * 3.4 + 'px');
    });

    cards.forEach((card, index) => {
      const offset = index - position;
      const depth = Math.abs(offset);
      const spread = offset / (1 + depth * .22);
      const opacity = .55 ** Math.max(0, depth - .28);
      const tilt = clamp(offset, -3, 3);
      const style = card.style;
      style.setProperty('--tile-x', spread * spacing * (offset < 0 ? .78 : 1) + 'px');
      style.setProperty('--tile-y', Math.abs(spread) * drop + 'px');
      style.setProperty('--tile-z', -depth * 75 + 'px');
      style.setProperty('--tile-scale', String(1 - Math.min(depth, 2) * .15 - Math.max(0, depth - 2) * .035));
      style.setProperty('--tile-yaw', (-1 - tilt * 8) + 'deg');
      style.setProperty('--tile-roll', (-1.4 + tilt * 8) + 'deg');
      style.setProperty('--tile-opacity', String(opacity));
      style.setProperty('--tile-softness', clamp((depth - .35) * .55, 0, 1.5) + 'px');
      style.setProperty('--tile-layer', String(Math.round(50 - depth * 14)));
    });

    const index = Math.round(position);
    if (index !== selected) {
      selected = index;
      showCaption(index);
    }
  }

  function paintIntro(progress) {
    if (progress === lastIntro) return;
    lastIntro = progress;
    const placement = smoothPhase(progress, .03, .43);
    const focus = smoothPhase(progress, .01, .42);
    const zoom = smoothPhase(progress, .43, .88);
    const fade = smoothPhase(progress, .49, .99);
    const cardsIn = smoothPhase(progress, .72, 1);

    stage.dataset.phase = progress === 1 ? 'projects'
      : progress > .72 ? 'transition' : progress > .43 ? 'zooming' : progress > .03 ? 'assembling' : 'scattered';

    stage.style.setProperty('--letters-placed', String(placement));
    stage.style.setProperty('--assembly-opacity', String((.36 + .64 * focus) * (1 - fade)));
    stage.style.setProperty('--assembly-scale', String(.67 + .33 * placement + (introZoom - 1) * zoom));
    stage.style.setProperty('--assembly-rise', -13 * zoom + 'px');
    stage.style.setProperty('--assembly-fog', ((1 - focus) * 6 + fade * 3.4) + 'px');
    stage.style.setProperty('--cards-opacity', String(cardsIn));
    stage.style.setProperty('--cards-scale', String(.87 + .13 * cardsIn));
    stage.style.setProperty('--cards-rise', (1 - cardsIn) * 43 + 'px');

    frame.inert = cardsIn < .7;
    cue.hidden = progress > .69;
    if (cardsIn >= .9 && focusAfterIntro) {
      focusAfterIntro = false;
      link.focus({ preventScroll: true });
    }
  }

  function paintScroll() {
    if (!sticky.matches) return;
    const offset = stickyTop - motionRect(track).top;
    paintIntro(clamp((offset + 1) / introTravel));

    const progress = clamp((offset - introTravel) / slideTravel, 0, last);
    const segment = Math.floor(progress);
    paint(segment + smoothPhase(progress - segment, .08, .92));
  }

  function resize() {
    track.toggleAttribute('data-sticky', sticky.matches);
    if (sticky.matches) {
      stickyTop = parseFloat(getComputedStyle(stage).top);
      const height = stage.clientHeight;
      const fitWidth = stage.clientWidth / Math.max(1, assemblyTitle.offsetWidth);
      const fitHeight = height / Math.max(1, assemblyTitle.offsetHeight);
      introZoom = Math.max(fitWidth * 1.54, Math.min(fitHeight * .98, fitWidth * 1.96));
      // Give each project a pace close to the four stages in Tech Stack.
      introTravel = Math.round(clamp(height * 1.15, 520, 1050));
      slideTravel = Math.round(clamp(height * .52, 250, 480));
      const endTravel = Math.round(slideTravel * .7);
      track.style.setProperty('--showcase-travel', introTravel + slideTravel * last + endTravel + 'px');
      lastIntro = -1;
    } else {
      frame.inert = false;
      cue.hidden = true;
      focusAfterIntro = false;
    }

    spacing = clamp(visual.clientWidth * .14, 53, 166);
    drop = clamp(visual.clientHeight * .072, 13, 35);
    paint(Math.round(position), true);
    paintScroll();
  }

  function goTo(index, skipIntro = false) {
    if (index < 0 || index > last || (index === selected && !skipIntro)) return;

    if (sticky.matches) {
      const start = window.scrollY + track.getBoundingClientRect().top - stickyTop;
      window.scrollTo({ top: start + introTravel + slideTravel * index, behavior: 'smooth' });
    } else {
      paint(index);
    }

    status.textContent = words.projectStatus(index + 1, cards.length, cards[index].dataset.title);
  }

  skip.addEventListener('click', () => {
    focusAfterIntro = true;
    goTo(0, true);
  });

  controls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-slide')) goTo(Number(button.dataset.slide));
    else goTo(selected + Number(button.dataset.step));
  });
  controls.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    goTo(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  });

  let dragStart;
  visual.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    dragStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    visual.setPointerCapture(event.pointerId);
  });
  visual.addEventListener('pointerup', event => {
    if (dragStart?.id !== event.pointerId) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    dragStart = undefined;
    if (Math.abs(dx) > 41 && Math.abs(dx) > Math.abs(dy) * 1.35) goTo(selected + (dx < 0 ? 1 : -1));
  });
  visual.addEventListener('pointercancel', () => { dragStart = undefined; });

  controls.hidden = false;
  track.dataset.ready = '';
  sticky.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  resize();
  return paintScroll;
}

function createVerbStory(section) {
  const stage = section.querySelector('.verb-stage');
  const [top, bottom] = [...stage.querySelectorAll('.verb-rail-track')].map(track => {
    const phrase = track.firstElementChild;
    for (let i = 0; i < 2; i += 1) {
      const repeat = phrase.cloneNode(true);
      repeat.className = 'verb-rail-repeat';
      track.append(repeat);
    }
    return { track, phrase };
  });
  const verbs = [...stage.querySelectorAll('[data-verb]')];
  const phases = [
    [-.025, .15, .209, .355], // Build
    [.218, .394, .452, .582], // Design
    [.451, .615, .665, .803], // Code
    [.662, .847, .889, 1]    // Ship
  ];
  let travel = 0;
  let topDistance = 0;
  let bottomStart = 0;
  let bottomDistance = 0;
  let lastPosition = -1;

  for (const verb of verbs) {
    const letters = Array.from(verb.textContent.trim(), (character, index) => {
      const letter = document.createElement('span');
      letter.className = 'verb-letter';
      letter.style.setProperty('--verb-letter-delay', String(index * .043));
      letter.textContent = character;
      return letter;
    });
    verb.replaceChildren(...letters);
  }

  function paint() {
    if (!sequenceMotion.matches) return;
    const position = clamp(-motionRect(section).top / travel);
    if (position === lastPosition) return;
    lastPosition = position;

    top.track.style.setProperty('--verb-rail-x', -topDistance * position + 'px');
    bottom.track.style.setProperty('--verb-rail-x', bottomStart + bottomDistance * position + 'px');

    verbs.forEach((verb, index) => {
      const [enter, settle, exit, gone] = phases[index];
      const arrival = smoothPhase(position, enter, settle);
      const departure = smoothPhase(position, exit, gone);
      const style = verb.style;
      style.setProperty('--verb-arrive', String(arrival));
      style.setProperty('--verb-wait', String(1 - arrival));
      style.setProperty('--verb-leave', String(departure));
      style.setProperty('--verb-opacity', String(arrival * (1 - departure ** 1.2)));
    });
  }

  function resize() {
    section.toggleAttribute('data-verb-pinned', sequenceMotion.matches);
    if (!sequenceMotion.matches) return;
    travel = Math.round(clamp(stage.clientHeight * (narrow.matches ? 2.07 : 2.45), 950, 2300));
    const width = stage.clientWidth;
    topDistance = Math.max(width * .44, top.phrase.offsetWidth - width * .42);
    bottomStart = -bottom.phrase.offsetWidth + width * .10;
    bottomDistance = -bottomStart - width * .05;
    section.style.setProperty('--verb-travel', travel + 'px');
    lastPosition = -1;
    paint();
  }

  sequenceMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  resize();
  return paint;
}

const progress = document.querySelector('.reading-progress');
const hero = document.querySelector('.hero');
const track = document.querySelector('[data-showcase]');
const updateShowcase = track ? visibleMotion(track, createShowcase(track)) : null;
const sequenceMotion = window.matchMedia('(min-height: 510px) and (prefers-reduced-motion: no-preference)');
const aboutStories = [...document.querySelectorAll('[data-about-story]')]
  .map(section => visibleMotion(section, createAboutStory(section)));
const proofStories = [...document.querySelectorAll('[data-proof-story]')]
  .map(section => visibleMotion(section, createProofStory(section)));
const verbStory = document.querySelector('[data-verb-story]');
const updateVerbStory = verbStory ? visibleMotion(verbStory, createVerbStory(verbStory)) : null;
const experience = document.querySelector('[data-experience]');
const updateExperience = experience ? visibleMotion(experience, createExperience(experience)) : null;
const techStacks = [...document.querySelectorAll('[data-tech-stack]')]
  .map(section => visibleMotion(section, createTechStack(section)));
const serviceStories = [...document.querySelectorAll('[data-service-story]')]
  .map(section => visibleMotion(section, createServiceStory(section)));
const contactFinales = [...document.querySelectorAll('[data-contact-finale]')]
  .map(section => visibleMotion(section, createContactFinale(section)));
const updateEditorialScenes = [...document.querySelectorAll('[data-editorial]')].map(section => visibleMotion(section, createEditorialScene(section)));
const headings = [...document.querySelectorAll('[data-scroll-type]')].map(heading => ({
  heading,
  region: observeMotionRegion(heading),
  lines: [...heading.querySelectorAll(':scope > .type-line')]
}));

const archive = document.querySelector('[data-archive]');
const contactScene = document.querySelector('[data-contact-scene]');
const archiveRegion = archive ? observeMotionRegion(archive) : null;
const contactRegion = contactScene ? observeMotionRegion(contactScene) : null;
const heroRegion = hero ? observeMotionRegion(hero) : null;
let scrollFrame = 0;
let scrollDistance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

function createServiceStory(section) {
  const stage = section.querySelector('.service-story-stage');
  const titleWords = [...section.querySelectorAll('[data-service-title]')].flatMap(separateWords);
  const rows = [...section.querySelectorAll('[data-service-row]')];
  let pinned = false;
  let stickyTop = 0;
  let travel = 1;
  let previous = -1;

  function paint() {
    if (reducedMotion.matches) return;
    const progress = pinned
      ? clamp((stickyTop - motionRect(section).top) / travel)
      : clamp((innerHeight * .9 - motionRect(section).top) / Math.min(innerHeight * .65, 480));
    if (pinned && progress === previous) return;
    previous = progress;
    titleWords.forEach((word, index) => {
      const delay = index / Math.max(1, titleWords.length - 1) * .06;
      word.style.setProperty('--service-word', smoothPhase(progress, delay, .15 + delay).toFixed(3));
    });
    stage.style.setProperty('--service-intro', smoothPhase(progress, .12, .22).toFixed(3));
    let finalRowPhase = 0;
    rows.forEach((row, index) => {
      const phase = pinned
        ? smoothPhase(progress, .26 + index * .17, .36 + index * .17)
        : smoothPhase(clamp((innerHeight * .92 - motionRect(row).top) / Math.min(innerHeight * .3, 240)), 0, 1);
      row.style.setProperty('--service-phase', phase.toFixed(3));
      const step = (name, start, end) => row.style.setProperty(name, smoothPhase(phase, start, end).toFixed(3));
      step('--art-frame', 0, .3);
      step('--art-outline', .08, .6);
      step('--art-detail', .25, .77);
      step('--art-arrow', .4, .85);
      step('--art-fill-a', .43, .78);
      step('--art-fill-b', .55, .88);
      step('--art-fill-c', .65, .95);
      step('--art-fill-d', .74, 1);
      [0, 1 / 3, 2 / 3, .99].forEach((threshold, dot) => {
        step('--service-dot-' + (dot + 1), threshold, Math.min(1, threshold + .025));
      });
      finalRowPhase = phase;
    });
    const connections = pinned ? smoothPhase(progress, .78, .95) : smoothPhase(finalRowPhase, .7, 1);
    const connect = (name, start, end) => section.style.setProperty(name, smoothPhase(connections, start, end).toFixed(3));
    connect('--connection-trunk', 0, .55);
    connect('--connection-a', .35, .72);
    connect('--connection-b', .5, .86);
    connect('--connection-c', .68, 1);
  }

  function resize() {
    const canPin = sequenceMotion.matches;
    section.removeAttribute('data-service-compact');
    section.toggleAttribute('data-service-pinned', canPin);
    stickyTop = canPin ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    const available = innerHeight - stickyTop;
    let height = stage.offsetHeight;
    if (canPin && !narrow.matches && height > available + 2) {
      section.setAttribute('data-service-compact', '');
      height = stage.offsetHeight;
    }
    pinned = canPin && height <= available + 2;
    section.toggleAttribute('data-service-pinned', pinned);
    if (pinned) {
      travel = Math.round(clamp(height * 2.5, 1700, 2400));
      section.style.setProperty('--service-extent', (height + travel + 1) + 'px');
    } else {
      section.removeAttribute('data-service-compact');
      section.style.removeProperty('--service-extent');
    }
    previous = -1;
    paint();
  }

  sequenceMotion.addEventListener('change', resize);
  reducedMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  resize();
  return paint;
}

function createContactFinale(section) {
  const stage = section.querySelector('.contact-finale-stage');
  const scattered = [[-35, 28, -12], [28, -26, 12], [-18, 38, -8], [30, 18, 10], [-24, -20, -11], [22, 30, 8]];
  const lines = [...section.querySelectorAll('[data-finale-line]')].map(line => {
    let count = 0;
    const letters = Array.from(line.textContent.normalize('NFC'), char => {
      if (/\s/.test(char)) return document.createTextNode(char);
      const letter = document.createElement('span');
      const [x, y, angle] = scattered[count++ % scattered.length];
      letter.className = 'finale-letter';
      letter.textContent = char;
      letter.style.setProperty('--final-x', x + 'px');
      letter.style.setProperty('--final-y', y + 'px');
      letter.style.setProperty('--final-angle', angle + 'deg');
      return letter;
    });
    line.setAttribute('aria-hidden', 'true');
    line.replaceChildren(...letters);
    return letters.filter(letter => letter.nodeType === Node.ELEMENT_NODE);
  });
  let pinned = false;
  let stickyTop = 0;
  let travel = 1;
  let previous = -1;

  function paint() {
    if (reducedMotion.matches) return;
    const rawProgress = pinned ? clamp((stickyTop - motionRect(section).top) / travel) : 1;
    // The standalone page starts partway into the reveal, without skipping it.
    const progress = section.closest('.contact-finale-page') ? .10 + rawProgress * .90 : rawProgress;
    if (progress === previous) return;
    previous = progress;
    stage.style.setProperty('--final-orb', smoothPhase(progress, 0, .42).toFixed(3));
    stage.style.setProperty('--final-meta', smoothPhase(progress, .18, .31).toFixed(3));
    lines.forEach((letters, line) => {
      const lineProgress = smoothPhase(progress, .32 + line * .12, .44 + line * .12);
      letters.forEach((letter, index) => {
        const lag = index / Math.max(1, letters.length - 1) * .3;
        letter.style.setProperty('--final-letter', smoothPhase(lineProgress, lag, .7 + lag).toFixed(3));
      });
    });
    stage.style.setProperty('--final-bottom', smoothPhase(progress, .84, .97).toFixed(3));
  }

  function resize() {
    const canPin = sequenceMotion.matches;
    section.toggleAttribute('data-finale-pinned', canPin);
    stickyTop = canPin ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    const height = stage.offsetHeight;
    pinned = canPin && height <= innerHeight - stickyTop + 2;
    section.toggleAttribute('data-finale-pinned', pinned);
    if (pinned) {
      travel = Math.round(clamp(height * 3.3, 2100, 3200));
      section.style.setProperty('--final-extent', (height + travel + 1) + 'px');
    } else section.style.removeProperty('--final-extent');
    previous = -1;
    paint();
  }
  sequenceMotion.addEventListener('change', resize);
  reducedMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  resize();
  return paint;
}

function createAboutStory(section) {
  const stage = section.querySelector('.about-stage');
  const step = section.querySelector('[data-about-step]');
  let pinned = false;
  let stickyTop = 0;
  let travel = 1;
  let previous = -1;

  function paint() {
    // Keep the sequence tied to the actual sticky position at the exit edge.
    const progress = !reducedMotion.matches && pinned
      ? clamp((stickyTop - section.getBoundingClientRect().top) / travel) : 1;
    if (progress === previous) return;
    previous = progress;
    stage.style.setProperty('--about-progress', progress.toFixed(4));
    stage.style.setProperty('--about-title', smoothPhase(progress, 0, .18).toFixed(4));
    stage.style.setProperty('--about-left', smoothPhase(progress, .05, .38).toFixed(4));
    stage.style.setProperty('--about-portrait', smoothPhase(progress, .18, .58).toFixed(4));
    stage.style.setProperty('--about-right', smoothPhase(progress, .48, .87).toFixed(4));
    if (step) step.textContent = String(Math.min(3, Math.floor(progress * 3) + 1)).padStart(2, '0') + ' / 03';
  }

  function resize() {
    const canPin = sequenceMotion.matches;
    section.toggleAttribute('data-about-pinned', canPin);
    stickyTop = canPin ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    const available = innerHeight - stickyTop;
    const height = stage.offsetHeight;
    pinned = canPin && height <= available + 2 && stage.scrollHeight <= available + 2;
    section.toggleAttribute('data-about-pinned', pinned);
    if (pinned) {
      travel = Math.round(clamp(height * 1.9, 1150, 1900));
      section.style.setProperty('--about-extent', (height + travel + 1) + 'px');
    } else section.style.removeProperty('--about-extent');
    previous = -1;
    paint();
  }

  sequenceMotion.addEventListener('change', resize);
  reducedMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  resize();
  return paint;
}

function createProofStory(section) {
  const stage = section.querySelector('.proof-stage');
  const items = [...section.querySelectorAll('[data-proof-item]')].map(item => ({
    element: item,
    number: item.querySelector('[data-count]'),
    total: Number(item.querySelector('[data-count]').dataset.count)
  }));
  // The curve is decorative and follows only the displayed values, not invented data.
  const grid = section.querySelector('.proof-grid');
  const svgNS = 'http://www.w3.org/2000/svg';
  const graph = document.createElementNS(svgNS, 'svg');
  graph.setAttribute('class', 'proof-growth');
  graph.setAttribute('aria-hidden', 'true');
  graph.setAttribute('focusable', 'false');
  const traces = items.slice(1).map(() => {
    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute('class', 'proof-trace');
    const halo = document.createElementNS(svgNS, 'path');
    const line = document.createElementNS(svgNS, 'path');
    halo.setAttribute('class', 'proof-trace-glow');
    line.setAttribute('class', 'proof-trace-line');
    halo.setAttribute('pathLength', '1');
    line.setAttribute('pathLength', '1');
    group.append(halo, line);
    graph.append(group);
    return { group, halo, line, visible: true };
  });
  const dots = items.map(() => {
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('class', 'proof-trace-dot');
    dot.setAttribute('r', '3.5');
    graph.append(dot);
    return dot;
  });
  const head = document.createElementNS(svgNS, 'circle');
  head.setAttribute('class', 'proof-trace-head');
  head.setAttribute('r', '3');
  graph.append(head);
  grid.append(graph);
  let points = [];
  let pinned = false;
  let stickyTop = 0;
  let travel = 1;
  let previous = -1;

  function sizeGraph() {
    const box = grid.getBoundingClientRect();
    graph.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    points = items.map(item => {
      const chart = item.element.querySelector('.proof-chart');
      const bar = item.element.querySelector('.proof-bar');
      const bounds = chart.getBoundingClientRect();
      return { x: bounds.left - box.left + bounds.width * .38, y: bounds.bottom - box.top - bar.offsetHeight };
    });
    points.forEach((point, index) => {
      dots[index].setAttribute('cx', point.x);
      dots[index].setAttribute('cy', point.y);
    });
    traces.forEach((trace, index) => {
      const a = points[index];
      const b = points[index + 1];
      // The mobile grid wraps into two rows; never draw across the text between rows.
      trace.visible = b.x > a.x;
      trace.group.style.display = trace.visible ? '' : 'none';
      const path = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
      trace.halo.setAttribute('d', path);
      trace.line.setAttribute('d', path);
    });
  }

  function paintGraph(phases) {
    dots.forEach((dot, index) => dot.style.setProperty('--dot-phase', smoothPhase(phases[index], .76, 1).toFixed(4)));
    traces.forEach((trace, index) => trace.group.style.setProperty('--trace-phase', phases[index + 1].toFixed(4)));
    const index = phases.findIndex((phase, i) => i > 0 && phase > 0 && phase < .995 && traces[i - 1].visible);
    if (index < 1 || !points.length) { head.style.setProperty('--head-phase', '0'); return; }
    const phase = phases[index];
    const a = points[index - 1];
    const b = points[index];
    head.setAttribute('cx', a.x + (b.x - a.x) * phase);
    head.setAttribute('cy', a.y + (b.y - a.y) * phase);
    head.style.setProperty('--head-phase', smoothPhase(phase, .04, .15).toFixed(4));
  }

  function showItem(item, phase, scanPosition, scanOpacity) {
    const value = Math.round(item.total * phase);
    const formatted = String(value).padStart(2, '0') + (item.number.dataset.suffix || '');
    if (item.number.textContent !== formatted) item.number.textContent = formatted;
    item.element.style.setProperty('--proof-phase', phase.toFixed(4));
    item.element.style.setProperty('--proof-scan-position', scanPosition.toFixed(4));
    item.element.style.setProperty('--proof-scan-opacity', scanOpacity.toFixed(4));
  }

  function paint() {
    if (reducedMotion.matches) {
      items.forEach(item => showItem(item, 1, 1, 0));
      paintGraph(items.map(() => 1));
      return;
    }
    const progress = pinned ? clamp((stickyTop - motionRect(section).top) / travel) : -1;
    if (pinned && progress === previous) return;
    previous = progress;
    const phases = [];
    items.forEach((item, index) => {
      // With a short viewport, reveal each item as it enters the screen instead.
      const local = pinned ? clamp(progress * items.length - index)
        : clamp((innerHeight * .96 - motionRect(item.element).top) / Math.min(innerHeight * .38, 260));
      const phase = smoothPhase(local, .04, .95);
      const scanOpacity = smoothPhase(local, 0, .1) * (1 - smoothPhase(local, .88, 1));
      showItem(item, phase, local, scanOpacity);
      phases.push(phase);
    });
    paintGraph(phases);
  }

  function resize() {
    const canPin = sequenceMotion.matches;
    section.toggleAttribute('data-proof-pinned', canPin);
    stickyTop = canPin ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    const height = stage.offsetHeight;
    pinned = canPin && height <= innerHeight - stickyTop + 2;
    section.toggleAttribute('data-proof-pinned', pinned);
    if (pinned) {
      travel = Math.round(clamp(height * 2.3, 1300, 2200));
      section.style.setProperty('--proof-extent', (height + travel + 1) + 'px');
    } else section.style.removeProperty('--proof-extent');
    sizeGraph();
    previous = -1;
    paint();
  }

  sequenceMotion.addEventListener('change', resize);
  reducedMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  resize();
  return paint;
}

function createTechStack(section) {
  const stage = section.querySelector('.tech-stack-stage');
  const cards = [...section.querySelectorAll('[data-tech-stack-item]')];
  let pinned = false;
  let stickyTop = 0;
  let travel = 1;
  let previous = -1;

  function paint() {
    if (reducedMotion.matches) return;
    const progress = pinned
      ? clamp((stickyTop - motionRect(section).top) / travel)
      : clamp((innerHeight * .05 - motionRect(section).top) / Math.min(innerHeight * .45, 360));
    if (pinned && progress === previous) return;
    previous = progress;
    stage.style.setProperty('--stack-accent', String(smoothPhase(progress, .02, .32)));
    cards.forEach((card, index) => {
      const phase = pinned
        ? smoothPhase(progress, .1 + index * .14, .34 + index * .14)
        : smoothPhase(clamp((innerHeight * .91 - motionRect(card).top) / Math.min(innerHeight * .33, 260)), 0, 1);
      card.style.setProperty('--stack-opacity', (.16 + .84 * phase).toFixed(3));
      card.style.setProperty('--stack-x', ((1 - phase) * (index % 2 ? 28 : -18)) + 'px');
      card.style.setProperty('--stack-y', ((1 - phase) * 15) + 'px');
    });
  }

  function resize() {
    const canPin = sequenceMotion.matches;
    section.removeAttribute('data-tech-compact');
    section.toggleAttribute('data-tech-pinned', canPin);
    stickyTop = canPin ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
    const available = innerHeight - stickyTop;
    let height = stage.offsetHeight;
    if (canPin && height > available + 2) {
      section.setAttribute('data-tech-compact', '');
      height = stage.offsetHeight;
    }
    pinned = canPin && height <= available + 2;
    section.toggleAttribute('data-tech-pinned', pinned);
    if (pinned) {
      travel = Math.round(clamp(height * 1.9, 1200, 2000));
      section.style.setProperty('--tech-extent', (height + travel + 1) + 'px');
    } else {
      section.removeAttribute('data-tech-compact');
      section.style.removeProperty('--tech-extent');
    }
    previous = -1;
    paint();
  }

  sequenceMotion.addEventListener('change', resize);
  narrow.addEventListener('change', resize);
  reducedMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  resize();
  return paint;
}

function createExperience(section) {
  const stage = section.querySelector('.experience-stage');
  const flow = stage.querySelector('.experience-flow');
  const title = stage.querySelector('[data-experience-title]');
  const heading = title.parentElement;
  const jobs = [...stage.querySelectorAll('.experience-job')];
  const summary = stage.querySelector('.experience-summary');
  const controls = stage.querySelector('.experience-controls');
  const [previous, next] = controls.querySelectorAll('button');
  const status = controls.querySelector('[data-experience-status]');
  const count = jobs.length;
  const tickets = jobs.map(job => job.querySelector('.experience-ticket'));
  const panels = [...jobs.map(job => job.querySelector('.experience-information')), summary.querySelector('.experience-recap')];
  const stops = [...jobs, summary].map(panel => ({ panel, anchor: panel.querySelector('.experience-stop') }));
  const letters = [];
  const headingText = title.textContent.trim().normalize('NFC');
  title.setAttribute('aria-label', headingText);
  title.replaceChildren(...headingText.split(/(\s+)/).map(part => {
    if (!part.trim()) return document.createTextNode(part);
    const word = document.createElement('span');
    word.className = 'experience-word';
    word.setAttribute('aria-hidden', 'true');
    for (const character of part) {
      const letter = document.createElement('span');
      letter.className = 'experience-letter';
      letter.textContent = character;
      letter.style.setProperty('--letter-direction', letters.length % 2 ? '1' : '-1');
      letters.push(letter);
      word.append(letter);
    }
    return word;
  }));

  const backdropGroup = stage.querySelector('.experience-backdrops');
  const backdrops = jobs.map(job => {
    const layer = document.createElement('div');
    const watermark = document.createElement('span');
    layer.className = 'experience-backdrop';
    layer.dataset.experienceTone = job.dataset.experienceTone;
    watermark.className = 'experience-watermark';
    watermark.textContent = job.querySelector('.experience-company-name').textContent;
    layer.append(watermark);
    return layer;
  });
  const finalBackdrop = document.createElement('div');
  finalBackdrop.className = 'experience-backdrop';
  backdrops.push(finalBackdrop);
  backdropGroup.append(...backdrops);

  let pinned = false;
  let step = 1;
  let scrollPadding = 0;
  let width = 0;
  let ticketWidth = 0;
  let cornerX = 0;
  let cornerY = 0;
  let cornerScale = .5;
  let previousProgress = -1;
  let active = -1;

  function dissolve(progress) {
    heading.style.setProperty('--experience-label-out', String(smoothPhase(progress, .17, .63)));
    for (let i = 0; i < letters.length; i += 1) {
      const offset = i / letters.length * .30;
      const fade = smoothPhase(progress, .065 + offset, .31 + offset);
      letters[i].style.setProperty('--letter-out', fade.toFixed(3));
    }
  }

  function paint() {
    if (reducedMotion.matches) return;
    const progress = pinned ? clamp(-motionRect(section).top / step, 0, count) :
      clamp((scrollPadding - motionRect(heading).top) / 120) * .65;
    if (progress === previousProgress) return;
    previousProgress = progress;
    dissolve(progress);
    if (!pinned) return;

    const current = Math.min(count, Math.floor(progress + .26));
    for (let i = 0; i <= count; i += 1) {
      const enter = i ? smoothPhase(progress, i - .47, i - .025) : 1;
      const leave = smoothPhase(progress, i + .43, i + .94);
      const entering = 1 - enter;
      const backdrop = backdrops[i].style;
      backdrop.setProperty('--experience-background', enter.toFixed(3));
      backdrop.setProperty('--experience-mark-x', (entering * 116 - leave * 104) + 'px');
      backdrop.setProperty('--experience-mark-opacity', String(1 - leave * .88));
      const panel = panels[i].style;
      panel.setProperty('--experience-info-opacity', (enter * (1 - leave)).toFixed(3));
      panel.setProperty('--experience-info-x', (entering * Math.min(width * .12, 115) - leave * 42) + 'px');
      panel.setProperty('--experience-info-y', (entering * 18) + 'px');
      if (i === count) continue;

      const card = tickets[i].style;
      const fanX = cornerX + ticketWidth * .25 * i;
      const fanAngle = -13 + i * 8;
      card.setProperty('--experience-card-x', (entering * Math.min(width * .25, 255) + leave * fanX) + 'px');
      card.setProperty('--experience-card-y', (entering * 30 + leave * cornerY) + 'px');
      card.setProperty('--experience-card-scale', String(1 - entering * .19 - leave * (1 - cornerScale)));
      card.setProperty('--experience-card-rotate', (entering * 10 + leave * fanAngle) + 'deg');
      card.setProperty('--experience-card-opacity', (enter * (1 - leave * .06)).toFixed(3));
      card.setProperty('--experience-card-layer', String(leave > .45 ? 6 + i : 12 + i));
    }
    if (current !== active) {
      active = current;
      panels.forEach((panel, index) => { panel.inert = index !== current; });
      previous.setAttribute('aria-disabled', String(current === 0));
      next.setAttribute('aria-disabled', String(current === count));
    }
  }

  function resize() {
    const allowMotion = !reducedMotion.matches;
    section.toggleAttribute('data-experience-motion', allowMotion);
    section.removeAttribute('data-experience-compact');
    section.toggleAttribute('data-experience-pinned', sequenceMotion.matches);
    controls.hidden = !sequenceMotion.matches;
    // The English copy may need more vertical space. Try a legible compact
    // layout before falling back to the ordinary document flow.
    if (sequenceMotion.matches && stage.offsetHeight > window.innerHeight + 2) {
      section.setAttribute('data-experience-compact', '');
    }
    const height = stage.offsetHeight;
    pinned = sequenceMotion.matches && height <= window.innerHeight + 2;
    section.toggleAttribute('data-experience-pinned', pinned);
    controls.hidden = !pinned;
    if (pinned) {
      const visual = tickets[0].parentElement.getBoundingClientRect();
      const bottom = flow.getBoundingClientRect().bottom;
      width = stage.clientWidth;
      ticketWidth = tickets[0].offsetWidth;
      const ticketHeight = tickets[0].offsetHeight;
      cornerScale = narrow.matches ? .40 : .51;
      cornerX = -visual.width / 2 + ticketWidth * .32;
      cornerY = narrow.matches ? ticketHeight * .10 :
        Math.max(0, bottom - (visual.top + visual.height / 2) - ticketHeight * .31);
      step = Math.round(clamp(height * .69, 400, 655));
      section.style.setProperty('--experience-height', height + 'px');
      section.style.setProperty('--experience-travel', step * (count + .52) + 'px');
    }
    scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    stops.forEach(({ panel, anchor }, index) => {
      const parent = pinned ? section : panel;
      if (anchor.parentElement !== parent) parent.prepend(anchor);
      if (pinned) anchor.style.setProperty('--experience-offset', scrollPadding + index * step + 'px');
    });
    if (!pinned) panels.forEach(panel => { panel.inert = false; });
    active = -1;
    previousProgress = -1;
    paint();
  }

  controls.addEventListener('click', event => {
    const button = event.target.closest('[data-experience-step]');
    if (!pinned || !button || button.getAttribute('aria-disabled') === 'true') return;
    const index = clamp(active + Number(button.dataset.experienceStep), 0, count);
    const start = window.scrollY + section.getBoundingClientRect().top;
    const name = panels[index].querySelector('h2, h3').textContent.trim();
    status.textContent = index === count ? name : words.experienceStatus(index + 1, count, name);
    window.scrollTo({ top: start + index * step, behavior: 'smooth' });
  });

  sequenceMotion.addEventListener('change', resize);
  reducedMotion.addEventListener('change', resize);
  window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  resize();
  return paint;
}

function separateWords(element) {
  const words = [];
  const nodes = element.textContent.trim().split(/(\s+)/).map(part => {
    if (!part.trim()) return document.createTextNode(part);
    const word = document.createElement('span');
    word.className = 'editorial-word';
    word.textContent = part;
    words.push(word);
    return word;
  });
  element.replaceChildren(...nodes);
  return words;
}

function createEditorialScene(section) {
  const stage = section.querySelector('.editorial-stage');
  const cue = stage.querySelector('.editorial-cue');
  const rows = [...stage.querySelectorAll('[data-editorial-row]')];
  const titleWords = rows.flatMap(separateWords);
  const copy = [...stage.querySelectorAll('[data-editorial-copy]')].flatMap(separateWords);
  const align = section.dataset.editorial === 'align';
  const rowOffsets = [[.03, .04, -5], [.19, .16, -7], [.42, .29, 6], [.34, .50, 8]];
  const motionPreference = align ? reducedMotion : sequenceMotion;
  let animated = false;
  let scrollStart = 0;
  let travel = 0;
  let previous = -1;

  copy.forEach((word, i) => {
    word.style.setProperty('--word-delay', String(i / Math.max(1, copy.length - 1) * .79));
  });

  function paint() {
    if (!animated) return;
    const position = clamp((scrollStart - motionRect(section).top) / travel);
    if (previous === position) return;
    previous = position;
    stage.style.setProperty('--editorial-copy', String(smoothPhase(position, align ? .50 : .59, .90)));

    if (align) {
      rows.forEach((row, i) => {
        const remaining = 1 - smoothPhase(position, i * .055, .50 + i * .055);
        const [x, y, rotation] = rowOffsets[i];
        row.style.setProperty('--row-x', x * remaining + 'em');
        row.style.setProperty('--row-y', y * remaining + 'em');
        row.style.setProperty('--row-rotate', rotation * remaining + 'deg');
        row.style.setProperty('--row-opacity', String(1 - remaining * (i < 2 ? .59 : .75)));
      });
    }

    titleWords.forEach((word, i) => {
      const stagger = i / Math.max(1, titleWords.length - 1);
      const style = word.style;
      if (align) {
        const remaining = 1 - smoothPhase(position, stagger * .22, .56 + stagger * .15);
        const direction = i % 2 === 0 ? 1 : -1;
        style.setProperty('--word-x', remaining * direction * .13 + 'em');
        style.setProperty('--word-y', remaining * direction * .16 + 'em');
        style.setProperty('--word-angle', remaining * direction * 4 + 'deg');
        style.setProperty('--word-fog', remaining * 1.4 + 'px');
        return;
      }

      const phase = clamp((position - stagger * .48 - .035) / .29);
      const remaining = (1 - phase) ** 2.2;
      const rebound = Math.sin(phase * Math.PI) * phase;
      style.setProperty('--word-y', (remaining * .69 - rebound * .37) + 'em');
      style.setProperty('--word-scale', String(1 - remaining * .16 + rebound * .15));
      style.setProperty('--word-visibility', String(1 - remaining));
      style.setProperty('--word-fog', remaining * 4 + 'px');
    });
  }

  function sizeStage() {
    const canAnimate = align ? !reducedMotion.matches : sequenceMotion.matches;
    let pinned = false;
    section.removeAttribute('data-editorial-compact');
    section.toggleAttribute('data-editorial-pinned', canAnimate);
    cue.hidden = !canAnimate;

    if (canAnimate) {
      const stickyTop = parseFloat(getComputedStyle(stage).top);
      const availableHeight = window.innerHeight - stickyTop;
      if (align && stage.offsetHeight > availableHeight + 2) {
        section.setAttribute('data-editorial-compact', '');
      }
      const height = stage.offsetHeight;
      const leadingSpace = align ? parseFloat(getComputedStyle(section).paddingTop) || 0 : 0;
      pinned = height <= availableHeight + 2;
      if (pinned) {
        scrollStart = stickyTop - leadingSpace;
        travel = Math.round(clamp(height * (align ? .91 : .79), 405, 750));
        section.style.setProperty('--editorial-extent', height + travel + leadingSpace + 1 + 'px');
      } else if (align) {
        // Short viewports reveal the same words while the section moves past.
        scrollStart = window.innerHeight * .86 - leadingSpace;
        travel = Math.max(120, window.innerHeight * .86 - stickyTop + height - availableHeight);
      }
    }

    animated = canAnimate && (align || pinned);
    section.toggleAttribute('data-editorial-pinned', pinned);
    section.toggleAttribute('data-editorial-motion', animated);
    if (!pinned) section.style.removeProperty('--editorial-extent');
    cue.hidden = !animated;
    previous = -1;
    paint();
  }

  motionPreference.addEventListener('change', sizeStage);
  window.addEventListener('resize', sizeStage);
  document.fonts?.ready.then(sizeStage);
  sizeStage();
  return paint;
}

function updateEditorialMotion() {
  if (reducedMotion.matches) return;
  const height = window.innerHeight;
  for (const { heading, lines, region } of headings) {
    if (!region.active) continue;
    const bounds = motionRect(heading);
    const travel = Math.max(130, Math.min(bounds.height * 0.78 + 109, height * 0.59));
    const position = clamp((height * 0.97 - bounds.top) / travel);
    lines.forEach((line, i) => {
      const delay = i * 0.13;
      const remaining = 1 - clamp((position - delay) / (1 - delay));
      const move = remaining * remaining;
      line.style.setProperty('--line-opacity', String(1 - move * 0.52));
      line.style.setProperty('--line-x', (i % 2 ? 28 : -18) * move + 'px');
      line.style.setProperty('--line-y', (42 + i * 14) * move + 'px');
      line.style.setProperty('--line-angle', (-5.7 + i * 8.8) * move + 'deg');
    });
  }
  if (archiveRegion?.active) {
    const offset = clamp((motionRect(archive).top - height * 0.37) / (height * 0.56), -1, 1);
    archive.style.setProperty('--archive-rise', -26 * offset + 'px');
    archive.style.setProperty('--archive-fall', 32 * offset + 'px');
    archive.style.setProperty('--archive-angle', -4 + offset * 6 + 'deg');
    archive.style.setProperty('--archive-angle-second', 3 - offset * 7 + 'deg');
  }
  if (contactRegion?.active) {
    const position = clamp(motionRect(contactScene).top / height);
    contactScene.style.setProperty('--contact-x', (position - 0.6) * 48 + 'px');
    contactScene.style.setProperty('--contact-y', position * 57 + 'px');
  }
}

function updateScroll(now) {
  scrollFrame = 0;
  const elapsed = motionLastTime ? Math.min(48, now - motionLastTime) : 16.667;
  motionLastTime = now;
  const distance = window.scrollY - motionScrollY;
  const damping = reducedMotion.matches || !desktopPointer.matches || Math.abs(distance) > innerHeight * 1.5
    ? 1 : 1 - Math.exp(-elapsed / 80);
  motionScrollY += distance * damping;
  if (Math.abs(window.scrollY - motionScrollY) < .15) motionScrollY = window.scrollY;
  progress.style.setProperty('--reading', String(clamp(window.scrollY / scrollDistance)));
  if (heroRegion?.active) {
    const y = reducedMotion.matches || narrow.matches ? 0 : Math.min(motionScrollY, hero.offsetHeight);
    hero.style.setProperty('--badge-lift', y * 0.126 + 'px');
    hero.style.setProperty('--grid-shift', y * 0.066 + 'px');
  }
  if (updateShowcase) updateShowcase();
  if (updateVerbStory) updateVerbStory();
  if (updateExperience) updateExperience();
  updateEditorialScenes.forEach(update => update());
  aboutStories.forEach(update => update());
  proofStories.forEach(update => update());
  techStacks.forEach(update => update());
  serviceStories.forEach(update => update());
  contactFinales.forEach(update => update());
  updateEditorialMotion();
  window.portfolioEnhancements?.paint();
  if (motionScrollY !== window.scrollY && !document.hidden) queueScrollUpdate();
}

function queueScrollUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}
// Smooth individual mouse-wheel notches while leaving touch, trackpads and
// nested scrollable controls to the browser. No scene captures or skips input.
let wheelFrame = 0;
let wheelTarget = 0;
let wheelTime = 0;
let wheelDirection = 0;
function stopWheelMotion() {
  if (wheelFrame) cancelAnimationFrame(wheelFrame);
  wheelFrame = 0;
  wheelTime = 0;
  wheelDirection = 0;
}
function advanceWheelMotion(now) {
  wheelFrame = 0;
  const elapsed = wheelTime ? Math.min(48, now - wheelTime) : 16.7;
  wheelTime = now;
  const limit = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  wheelTarget = clamp(wheelTarget, 0, limit);
  const remaining = wheelTarget - window.scrollY;
  if (Math.abs(remaining) < .5) {
    window.scrollTo({ top: wheelTarget, behavior: 'instant' });
    stopWheelMotion();
    return;
  }
  const gain = 1 - Math.exp(-elapsed / 145);
  window.scrollTo({ top: window.scrollY + remaining * gain, behavior: 'instant' });
  wheelFrame = requestAnimationFrame(advanceWheelMotion);
}
window.addEventListener('wheel', event => {
  if (reducedMotion.matches || event.defaultPrevented || event.ctrlKey || event.metaKey ||
      event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

  let target = event.target instanceof Element ? event.target : null;
  if (target?.closest('textarea, select, input, [contenteditable="true"]')) return;
  while (target && target !== document.body) {
    if (target.scrollHeight > target.clientHeight + 1) {
      const overflow = getComputedStyle(target).overflowY;
      const canScroll = event.deltaY < 0 ? target.scrollTop > 0 :
        target.scrollTop + target.clientHeight < target.scrollHeight - 1;
      if (canScroll && /auto|scroll/.test(overflow)) return;
    }
    target = target.parentElement;
  }

  if (!desktopPointer.matches || (event.deltaMode === 0 && Math.abs(event.deltaY) < 40)) {
    stopWheelMotion();
    return;
  }
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
  const delta = event.deltaY * unit * .9;
  const direction = Math.sign(delta);
  if (!wheelFrame || direction !== wheelDirection) wheelTarget = window.scrollY;
  wheelDirection = direction;
  wheelTarget = clamp(wheelTarget + delta, 0, Math.max(0, document.documentElement.scrollHeight - innerHeight));
  event.preventDefault();
  if (!wheelFrame) wheelFrame = requestAnimationFrame(advanceWheelMotion);
}, { passive: false });
window.addEventListener('pointerdown', stopWheelMotion, { passive: true });
window.addEventListener('touchstart', stopWheelMotion, { passive: true });
window.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stopWheelMotion();
});
reducedMotion.addEventListener('change', stopWheelMotion);
window.addEventListener('scroll', queueScrollUpdate, { passive: true });
function updateScrollSize() {
  scrollDistance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  queueScrollUpdate();
}
window.addEventListener('resize', updateScrollSize);
if ('ResizeObserver' in window) new ResizeObserver(updateScrollSize).observe(document.body);
window.addEventListener('pageshow', queueScrollUpdate);
reducedMotion.addEventListener('change', queueScrollUpdate);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  } else {
    motionScrollY = window.scrollY;
    motionLastTime = 0;
    queueScrollUpdate();
  }
});
document.fonts?.ready.then(updateScrollSize);
queueScrollUpdate();
