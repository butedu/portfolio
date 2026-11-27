/* Progressive enhancements for the expanded portfolio. */
(() => {
  const en = document.documentElement.lang === 'en';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const siteHeader = document.querySelector('.topbar');
  const discovery = document.querySelector('.nav-discovery');
  const toggle = discovery?.querySelector('.discovery-toggle');
  const panel = discovery?.querySelector('.discovery-panel');

  function setDiscovery(open, restoreFocus = false) {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (restoreFocus) toggle.focus();
  }
  if (toggle && panel) {
    siteHeader.dataset.discoveryReady = '';
    setDiscovery(false);
    toggle.addEventListener('click', () => setDiscovery(panel.hidden));
    toggle.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      setDiscovery(true);
      panel.querySelector('a').focus();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        setDiscovery(false, true);
      }
    });
    document.addEventListener('pointerdown', event => {
      if (!discovery.contains(event.target)) setDiscovery(false);
    });
    discovery.addEventListener('focusout', event => {
      if (!discovery.contains(event.relatedTarget)) setDiscovery(false);
    });
    panel.addEventListener('click', event => {
      if (event.target.closest('a')) setDiscovery(false);
    });
    matchMedia('(max-width: 920px)').addEventListener('change', () => setDiscovery(false));
  }

  // The mountain footer is navigable without motion; snow and parallax are enhancements.
  const snowFooter = document.querySelector('[data-snow-footer]');
  const snowToggle = snowFooter?.querySelector('[data-snow-toggle]');
  const snowFall = snowFooter?.querySelector('.snow-fall');
  if (snowFooter && snowToggle && snowFall) {
    let snowEnabled = true;
    let pointerFrame = 0;
    let lastPointer;
    for (let i = 0; i < 28; i += 1) {
      const flake = document.createElement('i');
      flake.className = 'snow-flake';
      flake.style.setProperty('--flake-x', ((i * 37 + 11) % 100) + '%');
      flake.style.setProperty('--flake-size', (1.5 + (i % 4) * .8) + 'px');
      flake.style.setProperty('--flake-opacity', String(.28 + (i % 5) * .13));
      flake.style.setProperty('--flake-time', (9 + (i % 7) * 1.5) + 's');
      flake.style.setProperty('--flake-delay', (-((i * 13) % 140) / 10) + 's');
      flake.style.setProperty('--flake-drift', (i % 2 ? 42 : -36) + 'px');
      snowFall.append(flake);
    }
    function refreshSnow() {
      const enabled = snowEnabled && !reduce.matches;
      snowFooter.classList.toggle('is-snowing', enabled);
      snowToggle.hidden = reduce.matches;
      snowToggle.setAttribute('aria-pressed', String(enabled));
      snowToggle.querySelector('[data-snow-label]').textContent = enabled
        ? (en ? 'Pause snowfall' : 'Tạm dừng tuyết')
        : (en ? 'Start snowfall' : 'Bật tuyết rơi');
    }
    function measureSnow() { snowFooter.style.setProperty('--snow-height', snowFooter.offsetHeight + 'px'); }
    snowToggle.addEventListener('click', () => { snowEnabled = !snowEnabled; refreshSnow(); });
    reduce.addEventListener('change', refreshSnow);
    window.addEventListener('resize', measureSnow);
    measureSnow();
    refreshSnow();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        snowFooter.classList.toggle('is-in-view', entries[0].isIntersecting);
        if (entries[0].isIntersecting) measureSnow();
      }, { rootMargin: '80px' });
      observer.observe(snowFooter);
    } else snowFooter.classList.add('is-in-view');
    snowFooter.addEventListener('pointermove', event => {
      if (!fine.matches || reduce.matches || event.pointerType === 'touch') return;
      lastPointer = { x: event.clientX, y: event.clientY };
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const box = snowFooter.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (lastPointer.x - box.left) / box.width));
        const y = Math.max(0, Math.min(1, (lastPointer.y - box.top) / box.height));
        snowFooter.style.setProperty('--snow-x', (x * 100).toFixed(1) + '%');
        snowFooter.style.setProperty('--snow-y', (y * 100).toFixed(1) + '%');
        snowFooter.style.setProperty('--mountain-x', ((.5 - x) * 20).toFixed(1) + 'px');
        snowFooter.style.setProperty('--mountain-y', ((.5 - y) * 10).toFixed(1) + 'px');
      });
    });
    snowFooter.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame); pointerFrame = 0;
      ['--snow-x', '--snow-y', '--mountain-x', '--mountain-y'].forEach(name => snowFooter.style.removeProperty(name));
    });
  }

  // Install the observer before enabling hidden starting states.
  const reveals = [...document.querySelectorAll('[data-studio-reveal]')];
  let revealObserver;
  if ('IntersectionObserver' in window && !reduce.matches) {
    revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: .08, rootMargin: '0px 0px -22px 0px' });
    for (const node of reveals) {
      if (node.getBoundingClientRect().top < innerHeight * .92) continue;
      const siblings = [...node.parentElement.children];
      node.style.setProperty('--reveal-delay', Math.min(180, siblings.indexOf(node) * 60) + 'ms');
      node.classList.add('studio-reveal-ready');
      revealObserver.observe(node);
    }
  }
  reduce.addEventListener('change', () => {
    if (!reduce.matches) return;
    revealObserver?.disconnect();
    reveals.forEach(node => node.classList.add('is-visible'));
  });

  const countFrames = new Map();
  function showFinalCount(node) {
    cancelAnimationFrame(countFrames.get(node));
    countFrames.delete(node);
    node.textContent = node.dataset.count.padStart(2, '0');
  }
  function countUp(node) {
    if (reduce.matches) { showFinalCount(node); return; }
    const total = Number(node.dataset.count);
    const start = performance.now();
    let last = -1;
    function paint(now) {
      const progress = Math.min(1, (now - start) / 1050);
      const value = Math.round(total * (1 - (1 - progress) ** 3));
      if (value !== last) node.textContent = String(value).padStart(2, '0');
      last = value;
      if (progress < 1 && !reduce.matches && !document.hidden) countFrames.set(node, requestAnimationFrame(paint));
      else showFinalCount(node);
    }
    countFrames.set(node, requestAnimationFrame(paint));
  }
  // The proof display is animated by the shared scroll timeline in main.js.
  const counts = [...document.querySelectorAll('[data-count]')].filter(node => !node.closest('[data-proof-story]'));
  if ('IntersectionObserver' in window && !reduce.matches) {
    const counterObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }, { threshold: .6 });
    counts.forEach(node => {
      const link = node.closest('a');
      link.setAttribute('aria-label', node.dataset.count + ' ' + link.querySelector(':scope > span').textContent);
      node.setAttribute('aria-hidden', 'true');
      counterObserver.observe(node);
    });
  }
  reduce.addEventListener('change', () => { if (reduce.matches) counts.forEach(showFinalCount); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) counts.forEach(showFinalCount); });

  // Share the existing on-demand scroll frame, with no independent render loop.
  const scenePainters = [...document.querySelectorAll('[data-studio-scene]')].map(scene => visibleMotion(scene, () => {
    const bounds = motionRect(scene);
    const progress = clamp((innerHeight - bounds.top) / (innerHeight + bounds.height));
    scene.style.setProperty('--scene-progress', progress.toFixed(4));
    scene.style.setProperty('--proof-progress', String(clamp(progress * 1.8)));
  }));
  window.portfolioEnhancements = { paint() { scenePainters.forEach(paint => paint()); } };

  for (const card of document.querySelectorAll('[data-studio-tilt]')) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0, lastTime = 0;
    function paint(now) {
      frame = 0;
      const elapsed = lastTime ? Math.min(40, now - lastTime) : 16;
      lastTime = now;
      const gain = 1 - Math.exp(-elapsed / 90);
      currentX += (targetX - currentX) * gain;
      currentY += (targetY - currentY) * gain;
      card.style.setProperty('--tilt-x', currentX.toFixed(3) + 'deg');
      card.style.setProperty('--tilt-y', currentY.toFixed(3) + 'deg');
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .015) frame = requestAnimationFrame(paint);
      else card.classList.remove('is-tilting');
    }
    function schedule() {
      if (!frame) { lastTime = 0; frame = requestAnimationFrame(paint); }
      card.classList.add('is-tilting');
    }
    card.addEventListener('pointermove', event => {
      if (!fine.matches || reduce.matches || event.pointerType === 'touch') return;
      const bounds = card.getBoundingClientRect();
      targetX = (.5 - (event.clientY - bounds.top) / bounds.height) * 4;
      targetY = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
      schedule();
    });
    card.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); });
    function resetTilt() {
      cancelAnimationFrame(frame); frame = 0;
      targetX = targetY = currentX = currentY = 0;
      card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y');
      card.classList.remove('is-tilting');
    }
    reduce.addEventListener('change', resetTilt);
    fine.addEventListener('change', resetTilt);
    document.addEventListener('visibilitychange', () => { if (document.hidden) resetTilt(); });
  }

  const form = document.querySelector('[data-project-brief]');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = data.get('name').trim();
    const email = data.get('email').trim();
    const message = data.get('message').trim();
    const status = form.querySelector('[data-brief-status]');
    if (!name || !email || message.length < 10) {
      status.textContent = en ? 'Please enter your name, email and at least 10 characters about the project.' : 'Vui lòng nhập tên, email và ít nhất 10 ký tự mô tả công việc.';
      return;
    }
    const service = data.get('service');
    const subject = `${service} · ${name} · Portfolio Trường Duy`;
    const body = `${en ? 'Name' : 'Tên'}: ${name}\nEmail: ${email}\n${en ? 'Service' : 'Hạng mục'}: ${service}\n\n${message}`;
    status.textContent = en ? 'Your email app will open with the draft. Review it and press Send there.' : 'Ứng dụng email sẽ mở bản nháp. Bạn kiểm tra nội dung và bấm Gửi trong ứng dụng đó.';
    location.href = `mailto:mbf2907.ntkh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    // The owner's Google Apps Script web-app URL is inserted after deployment.
    const contactEndpoint = 'https://script.google.com/macros/s/AKfycbyaEt33kLdFzdrPxZCB7K2JXHlGYnPvGShBzxFJFUQsiMe0ZPzfIuCD5Kzggvg_NDjxqA/exec';
    const status = contactForm.querySelector('[data-contact-form-status]');
    const button = contactForm.querySelector('button[type="submit"]');
    const nameField = contactForm.elements.namedItem('name');
    const messageField = contactForm.elements.namedItem('message');
    const originField = contactForm.elements.namedItem('origin');
    const requestField = contactForm.elements.namedItem('requestId');
    const ready = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(contactEndpoint);
    let pending = null;

    if (!ready) {
      status.textContent = en ? 'This form is being connected. Please use the email address above for now.' : 'Form đang được kết nối. Bạn vui lòng dùng địa chỉ email phía trên trong lúc này.';
    } else {
      const receiver = document.createElement('iframe');
      receiver.name = 'portfolio-contact-receiver';
      receiver.hidden = true;
      receiver.setAttribute('aria-hidden', 'true');
      receiver.tabIndex = -1;
      contactForm.after(receiver);
      contactForm.action = contactEndpoint;
      contactForm.target = receiver.name;
      button.disabled = false;
    }

    function complete() {
      if (!pending) return;
      clearTimeout(pending.timer);
      pending = null;
      button.disabled = false;
      contactForm.removeAttribute('aria-busy');
    }

    window.addEventListener('message', event => {
      if (!pending || !event.data || typeof event.data !== 'object') return;
      let sender;
      try { sender = new URL(event.origin); } catch { return; }
      if (sender.protocol !== 'https:' || (sender.hostname !== 'script.google.com' && !sender.hostname.endsWith('.googleusercontent.com'))) return;
      const result = event.data;
      if (result.type !== 'portfolio-contact-result' || result.requestId !== pending.id || typeof result.ok !== 'boolean') return;
      complete();
      if (result.ok) {
        contactForm.reset();
        status.textContent = en ? 'Your message has been sent. Thank you — I’ll get back to you soon.' : 'Lời nhắn đã được gửi. Cảm ơn bạn, mình sẽ phản hồi sớm!';
      } else {
        status.textContent = en ? 'Your message could not be sent. Please try again later or use the email address above.' : 'Chưa gửi được lời nhắn. Bạn vui lòng thử lại sau hoặc dùng địa chỉ email phía trên.';
      }
    });

    [nameField, messageField].forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!ready || pending) return;
      const data = new FormData(contactForm);
      const name = String(data.get('name') || '').trim();
      const message = String(data.get('message') || '').trim();
      nameField.setCustomValidity(name.length >= 2 ? '' : (en ? 'Please enter your name.' : 'Vui lòng nhập họ và tên.'));
      messageField.setCustomValidity(message.length >= 10 ? '' : (en ? 'Please enter at least 10 characters.' : 'Vui lòng nhập ít nhất 10 ký tự.'));
      if (!contactForm.reportValidity()) return;

      const bytes = new Uint8Array(16);
      if (!window.crypto?.getRandomValues) {
        status.textContent = en ? 'Please use a secure connection to send your message.' : 'Bạn vui lòng mở website bằng kết nối bảo mật để gửi lời nhắn.';
        return;
      }
      window.crypto.getRandomValues(bytes);
      const id = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
      originField.value = window.location.origin;
      requestField.value = id;
      pending = { id, timer: setTimeout(() => {
        complete();
        status.textContent = en ? 'We could not confirm delivery. Please contact me by email before trying again.' : 'Chưa xác nhận được việc gửi. Bạn vui lòng liên hệ qua email trước khi gửi lại.';
      }, 30000) };
      button.disabled = true;
      contactForm.setAttribute('aria-busy', 'true');
      status.textContent = en ? 'Sending your message…' : 'Đang gửi lời nhắn…';
      HTMLFormElement.prototype.submit.call(contactForm);
    });
  }

  const prefetched = new Set();
  document.addEventListener('pointerover', event => {
    if (!/^https?:$/.test(location.protocol) || !fine.matches || navigator.connection?.saveData || prefetched.size >= 4) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html') || url.pathname === location.pathname || prefetched.has(url.pathname)) return;
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch'; prefetch.href = url.origin + url.pathname;
    prefetched.add(url.pathname); document.head.append(prefetch);
  }, { passive: true });
  queueScrollUpdate();
})();
