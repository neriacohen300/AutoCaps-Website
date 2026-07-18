var currentFeature = 'captions';
var running = { captions: false, silence: false, podcast: false };
var done = { captions: false, silence: false, podcast: false };

var toolTitles = {
  captions: 'AutoCaps — כתוביות',
  silence: 'AutoCaps — חיתוך שקט',
  podcast: 'AutoCaps — פודקאסט'
};

/* ---------------- Waveform generation ---------------- */
function fillWaveform(el, seed) {
  if (!el || el.dataset.filled) return;
  el.dataset.filled = '1';
  var width = el.getBoundingClientRect().width || 60;
  var count = Math.max(4, Math.round(width / 7));
  var s = seed || 1;
  function rand() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }
  for (var i = 0; i < count; i++) {
    var bar = document.createElement('div');
    bar.className = 'wf-bar';
    var h = 25 + rand() * 70;
    bar.style.height = h.toFixed(0) + '%';
    el.appendChild(bar);
  }
}

function initWaveforms() {
  var seed = 7;
  document.querySelectorAll('.waveform').forEach(function (el) {
    seed += 13;
    fillWaveform(el, seed);
  });
}

document.addEventListener('DOMContentLoaded', initWaveforms);

/* ---------------- Tab switching ---------------- */
function switchFeature(feature) {
  if (feature === currentFeature) return;
  currentFeature = feature;

  ['captions', 'silence', 'podcast'].forEach(function (f) {
    var pill = document.getElementById('fpill-' + f);
    if (pill) pill.classList.toggle('active', f === feature);

    var panel = document.querySelector('.tool-panel[data-panel="' + f + '"]');
    if (panel) panel.classList.toggle('active', f === feature);

    var stage = document.querySelector('.feature-stage[data-stage="' + f + '"]');
    if (stage) stage.classList.toggle('active', f === feature);
  });

  document.getElementById('tool-win-title').textContent = toolTitles[feature];
  setTimeout(initWaveforms, 30);
}

function setStatus(key, text, cls) {
  var st = document.getElementById('status-' + key);
  if (!st) return;
  st.textContent = text;
  st.className = 'status-text' + (cls ? ' ' + cls : '');
}

/* ---------------- AutoCaptions ---------------- */
function resetCaptions() {
  if (running.captions) return;
  done.captions = false;
  var btn = document.getElementById('btn-captions');
  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-sparkles" aria-hidden="true"></i> צור כתוביות';
  btn.onclick = runCaptionsDemo;
  document.getElementById('spinner-captions').classList.remove('show');
  setStatus('captions', 'מוכן להרצה');

  var track = document.getElementById('cap-cap-track');
  if (track) track.style.opacity = '0';
  [1, 2, 3].forEach(function (i) {
    var cap = document.getElementById('cap-cap' + i);
    if (cap) cap.style.opacity = '0';
    var wf = document.getElementById('cap-wf' + i);
    if (wf) wf.classList.remove('show');
  });
}

function runCaptionsDemo() {
  if (running.captions || done.captions) return;
  running.captions = true;
  var btn = document.getElementById('btn-captions');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> מעבד...';
  document.getElementById('spinner-captions').classList.add('show');
  setStatus('captions', 'מנתח אודיו...', 'active');

  var track = document.getElementById('cap-cap-track');

  setTimeout(function () { setStatus('captions', 'מזהה דיבור בעברית...', 'active'); }, 900);
  setTimeout(function () { setStatus('captions', 'יוצר כתוביות...', 'active'); }, 1900);

  setTimeout(function () {
    track.style.opacity = '1';
    var c1 = document.getElementById('cap-cap1');
    if (c1) c1.style.opacity = '1';
    var w1 = document.getElementById('cap-wf1');
    if (w1) w1.classList.add('show');
  }, 2600);

  setTimeout(function () {
    var c2 = document.getElementById('cap-cap2');
    if (c2) c2.style.opacity = '1';
    var w2 = document.getElementById('cap-wf2');
    if (w2) w2.classList.add('show');
  }, 3100);

  setTimeout(function () {
    var c3 = document.getElementById('cap-cap3');
    if (c3) c3.style.opacity = '1';
    var w3 = document.getElementById('cap-wf3');
    if (w3) w3.classList.add('show');
  }, 3600);

  setTimeout(function () {
    document.getElementById('spinner-captions').classList.remove('show');
    setStatus('captions', '✓ כתוביות נוספו בהצלחה', 'done');
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> הרץ שוב';
    running.captions = false;
    done.captions = true;
    btn.onclick = function () {
      resetCaptions();
      setTimeout(runCaptionsDemo, 50);
    };
  }, 4200);
}

/* ---------------- AutoCut Silences ---------------- */
function resetSilence() {
  if (running.silence) return;
  done.silence = false;
  ['seg-gap1', 'seg-gap2'].forEach(function (id) {
    var gap = document.getElementById(id);
    if (gap) gap.classList.remove('cut');
  });
  ['pr-v2', 'pr-v3', 'seg-sp2', 'seg-sp3'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.style.transform = 'translateX(0)';
  });
  var btn = document.getElementById('btn-silence');
  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-scissors" aria-hidden="true"></i> חתוך שקט';
  btn.onclick = cutSilence;
  document.getElementById('spinner-silence').classList.remove('show');
  setStatus('silence', 'מוכן להרצה');
}

function cutSilence() {
  if (running.silence || done.silence) return;
  running.silence = true;
  var btn = document.getElementById('btn-silence');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> מזהה שקט...';
  document.getElementById('spinner-silence').classList.add('show');
  setStatus('silence', 'סורק את גל האודיו לאיתור קטעי שקט...', 'active');

  setTimeout(function () { setStatus('silence', 'נמצאו 2 קטעי שקט...', 'active'); }, 900);

  setTimeout(function () {
    setStatus('silence', 'חותך ומזיז קליפים...', 'active');
    ['seg-gap1', 'seg-gap2'].forEach(function (id) {
      var gap = document.getElementById(id);
      if (gap) gap.classList.add('cut');
    });
    var v2 = document.getElementById('pr-v2');
    var v3 = document.getElementById('pr-v3');
    var sp2 = document.getElementById('seg-sp2');
    var sp3 = document.getElementById('seg-sp3');
    if (v2) v2.style.transform = 'translateX(-35px)';
    if (v3) v3.style.transform = 'translateX(-70px)';
    if (sp2) sp2.style.transform = 'translateX(-35px)';
    if (sp3) sp3.style.transform = 'translateX(-70px)';
  }, 1700);

  setTimeout(function () {
    document.getElementById('spinner-silence').classList.remove('show');
    setStatus('silence', '✓ 2 קטעי שקט נחתכו בהצלחה', 'done');
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> הרץ שוב';
    running.silence = false;
    done.silence = true;
    btn.onclick = function () {
      resetSilence();
      setTimeout(cutSilence, 50);
    };
  }, 2900);
}

/* ---------------- AutoCut Podcast ---------------- */
var podcastCamMap = ['camA', 'camB', 'camA', 'master', 'camB'];
var podcastMicMap = [['mic1'], ['mic2'], ['mic1'], ['mic1', 'mic2'], ['mic2']];
var podcastCutOffsets = [100, 170, 230, 330];

function resetPodcast() {
  if (running.podcast) return;
  done.podcast = false;

  document.querySelectorAll('.cam-seg').forEach(function (el) { el.classList.remove('active'); });
  document.querySelectorAll('.mic-seg').forEach(function (el) { el.classList.remove('active'); });
  document.querySelectorAll('.cut-marker').forEach(function (el) { el.classList.remove('show'); });

  var btn = document.getElementById('btn-podcast');
  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-camera" aria-hidden="true"></i> עריכת פודקאסט';
  btn.onclick = runPodcastDemo;
  document.getElementById('spinner-podcast').classList.remove('show');
  setStatus('podcast', 'מוכן להרצה');
}

function runPodcastDemo() {
  if (running.podcast || done.podcast) return;
  running.podcast = true;
  var btn = document.getElementById('btn-podcast');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> מזהה דוברים...';
  document.getElementById('spinner-podcast').classList.add('show');
  setStatus('podcast', 'מנתח מי מדבר בכל מיקרופון...', 'active');

  var delays = [1300, 1750, 2200, 2650, 3100];

  setTimeout(function () { setStatus('podcast', 'בונה מפת חיתוכים בין המצלמות...', 'active'); }, 900);
  setTimeout(function () {
    btn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> מחליף מצלמות...';
    setStatus('podcast', 'מחליף אוטומטית בין דוברים...', 'active');
  }, 1300);

  for (var i = 1; i <= 5; i++) {
    (function (segIndex) {
      setTimeout(function () {
        var cam = podcastCamMap[segIndex - 1];
        var mics = podcastMicMap[segIndex - 1];

        var camEl = document.querySelector('.cam-seg.' + cam + '[data-seg="' + segIndex + '"]');
        if (camEl) camEl.classList.add('active');

        mics.forEach(function (mic) {
          var micEl = document.querySelector('.mic-seg.' + mic + '[data-seg="' + segIndex + '"]');
          if (micEl) micEl.classList.add('active');
        });

        if (segIndex > 1) {
          var marker = document.querySelector('.cut-marker[style*="left:' + podcastCutOffsets[segIndex - 2] + 'px"]');
          if (marker) marker.classList.add('show');
        }
      }, delays[segIndex - 1]);
    })(i);
  }

  setTimeout(function () {
    document.getElementById('spinner-podcast').classList.remove('show');
    setStatus('podcast', '✓ 4 מעברי מצלמה נוצרו אוטומטית', 'done');
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> הרץ שוב';
    running.podcast = false;
    done.podcast = true;
    btn.onclick = function () {
      resetPodcast();
      setTimeout(runPodcastDemo, 50);
    };
  }, 3700);
}