if (typeof window !== 'undefined') {
  let starCount = null;

  function applyStarCount() {
    const el = document.querySelector('.github-star-count');
    if (!el || !starCount || el.textContent === starCount) return;
    el.textContent = starCount;
  }

  function fetchStarCount() {
    const cached = sessionStorage.getItem('gh-stars-pikku');
    if (cached) {
      starCount = cached;
      applyStarCount();
      return;
    }
    fetch('https://api.github.com/repos/pikkujs/pikku')
      .then(r => r.json())
      .then(data => {
        if (data.stargazers_count != null) {
          starCount = String(data.stargazers_count);
          sessionStorage.setItem('gh-stars-pikku', starCount);
          applyStarCount();
        }
      })
      .catch(() => {});
  }

  // Fetch once on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchStarCount);
  } else {
    fetchStarCount();
  }

  // Re-apply after SPA navigations (navbar may re-render)
  new MutationObserver(() => {
    if (starCount) applyStarCount();
  }).observe(document.documentElement, { childList: true, subtree: true });
}
