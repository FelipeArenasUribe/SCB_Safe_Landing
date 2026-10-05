document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const scrollButton = document.querySelector('.scroll-to-top');
  const copyButton = document.querySelector('.copy-bibtex-btn');
  const bibtex = document.getElementById('bibtex-code');
  const resultVideo = document.getElementById('results-video');
  const resultTitle = document.getElementById('simulation-title');
  const resultCaption = document.getElementById('simulation-caption');
  const tabs = document.querySelectorAll('.simulation-tab');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateScrollState = () => {
    const scrolled = window.scrollY > 40;
    header?.classList.toggle('is-scrolled', scrolled);
    scrollButton?.classList.toggle('visible', window.scrollY > 600);
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });

  scrollButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  copyButton?.addEventListener('click', async () => {
    if (!bibtex) return;
    const text = bibtex.textContent;

    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }

    copyButton.classList.add('copied');
    copyButton.querySelector('.copy-text').textContent = 'Copied';
    window.setTimeout(() => {
      copyButton.classList.remove('copied');
      copyButton.querySelector('.copy-text').textContent = 'Copy';
    }, 1800);
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });

      if (!resultVideo) return;
      const source = resultVideo.querySelector('source');
      source.src = tab.dataset.video;
      resultTitle.textContent = tab.dataset.title;
      resultCaption.textContent = tab.dataset.caption;
      resultVideo.load();
      if (!reduceMotion) resultVideo.play().catch(() => {});
    });
  });

  if (reduceMotion) {
    document.querySelectorAll('video[autoplay]').forEach((video) => video.pause());
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  }
});
