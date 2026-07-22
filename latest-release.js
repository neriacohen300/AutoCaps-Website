/* ---------------- Auto-updating download links ---------------- */
/*
 * Fetches the release list from the GitHub API and points each
 * download button at the newest release for its product, so the
 * page never needs to be edited by hand when a new version ships.
 *
 * Tag convention used in the AutoCaps repo:
 *   v1.2.3            -> Premiere Pro
 *   v1.2.3-resolve     -> DaVinci Resolve
 *   v1.2.3-ae          -> After Effects
 */
(function () {
  var REPO = 'neriacohen300/AutoCaps';
  var API_URL = 'https://api.github.com/repos/' + REPO + '/releases?per_page=100';
  var CACHE_KEY = 'autocaps_releases_cache_v1';
  var CACHE_TTL = 1000 * 60 * 30; // 30 minutes

  var PRODUCTS = {
    premiere: { match: function (tag) { return !/-resolve$/.test(tag) && !/-ae$/.test(tag); } },
    resolve:  { match: function (tag) { return /-resolve$/.test(tag); } },
    ae:       { match: function (tag) { return /-ae$/.test(tag); } }
  };

  function setButton(product, release) {
    var link = document.getElementById('dl-' + product);
    var verEl = document.getElementById('ver-' + product);
    if (!link) return;

    var asset = release.assets && release.assets.length ? release.assets[0] : null;

    link.href = asset ? asset.browser_download_url : release.html_url;
    link.target = '_blank';

    if (verEl) {
      verEl.textContent = 'גרסה אחרונה: ' + release.tag_name;
      verEl.classList.remove('error');
    }
  }

  function setError(product) {
    var verEl = document.getElementById('ver-' + product);
    if (verEl) {
      verEl.textContent = 'לא ניתן לטעון גרסה עדכנית — קישור לעמוד ה-Releases';
      verEl.classList.add('error');
    }
  }

  function pickLatest(releases) {
    var result = {};
    Object.keys(PRODUCTS).forEach(function (key) {
      var matches = releases
        .filter(function (r) { return !r.draft && PRODUCTS[key].match(r.tag_name); })
        .sort(function (a, b) {
          return new Date(b.published_at) - new Date(a.published_at);
        });
      if (matches.length) result[key] = matches[0];
    });
    return result;
  }

  function applyReleases(releases) {
    var latest = pickLatest(releases);
    Object.keys(PRODUCTS).forEach(function (product) {
      if (latest[product]) {
        setButton(product, latest[product]);
      } else {
        setError(product);
      }
    });
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || (Date.now() - parsed.time) > CACHE_TTL) return null;
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data: data }));
    } catch (e) {
      /* ignore quota / privacy-mode errors */
    }
  }

  function init() {
    var cached = readCache();
    if (cached) {
      applyReleases(cached);
      return;
    }

    fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API error ' + res.status);
        return res.json();
      })
      .then(function (releases) {
        applyReleases(releases);
        writeCache(releases);
      })
      .catch(function () {
        Object.keys(PRODUCTS).forEach(setError);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
