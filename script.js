var currentTab = 'pr';
var running = false;
var silenceCutRunning = false;
var silenceCut = false;

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-pr').classList.toggle('active', tab === 'pr');
  document.getElementById('tab-dv').classList.toggle('active', tab === 'dv');
  document.getElementById('view-pr').style.display = tab === 'pr' ? '' : 'none';
  document.getElementById('view-dv').style.display = tab === 'dv' ? '' : 'none';
  document.getElementById('app-title').textContent = tab === 'pr' ? 'Premiere Pro — AutoCaps' : 'DaVinci Resolve — AutoCaps';
  reset();
}

function reset() {
  if (running) return;
  var btn = document.getElementById('run-btn');
  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-sparkles" aria-hidden="true"></i> צור כתוביות';
  document.getElementById('spinner').classList.remove('show');
  
  var st = document.getElementById('status-text');
  st.textContent = 'לחץ כדי לראות את התוסף בפעולה';
  st.className = 'status-text';
  
  ['pr', 'dv'].forEach(function(t) {
    var track = document.getElementById(t + '-cap-track');
    if (track) { 
      track.style.opacity = '0'; 
    }
    [1, 2, 3].forEach(function(i) {
      var cap = document.getElementById(t + '-cap' + i);
      if (cap) { 
        cap.style.opacity = '0'; 
      }
    });
  });

  resetSilence();
}

function resetSilence() {
  if (silenceCutRunning) return;
  silenceCut = false;
  ['pr-gap1', 'pr-gap2', 'pr-gap3'].forEach(function(id) {
    var gap = document.getElementById(id);
    if (gap) { gap.classList.remove('cut'); }
  });
  ['pr-v2', 'pr-v3', 'pr-a2'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.style.transform = 'translateX(0)'; }
  });
  var sbtn = document.getElementById('silence-btn');
  if (sbtn) {
    sbtn.disabled = false;
    sbtn.innerHTML = '<i class="ti ti-scissors" aria-hidden="true"></i> חתוך שקט';
  }
}

function cutSilence() {
  if (silenceCutRunning || silenceCut) return;
  silenceCutRunning = true;
  var sbtn = document.getElementById('silence-btn');
  sbtn.disabled = true;
  sbtn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> מזהה שקט...';

  var st = document.getElementById('status-text');
  st.textContent = 'סורק את הטיימליין לאיתור קטעי שקט...';
  st.className = 'status-text active';

  setTimeout(function() {
    st.textContent = 'נמצאו 2 קטעי שקט...';
  }, 900);

  setTimeout(function() {
    st.textContent = 'חותך ומזיז קליפים...';
    ['pr-gap1', 'pr-gap2', 'pr-gap3'].forEach(function(id) {
      var gap = document.getElementById(id);
      if (gap) { gap.classList.add('cut'); }
    });
    // shift everything after gap1 (15px) and gap2 (15px) left in the video track
    var v2 = document.getElementById('pr-v2');
    var v3 = document.getElementById('pr-v3');
    var a2 = document.getElementById('pr-a2');
    if (v2) { v2.style.transform = 'translateX(-35px)'; }
    if (v3) { v3.style.transform = 'translateX(-70px)'; }
    if (a2) { a2.style.transform = 'translateX(-40px)'; }
  }, 1700);

  setTimeout(function() {
    st.textContent = '✓ 2 קטעי שקט נחתכו בהצלחה';
    st.className = 'status-text done';
    sbtn.disabled = false;
    sbtn.innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> הרץ שוב';
    silenceCutRunning = false;
    silenceCut = true;
    sbtn.onclick = function() {
      resetSilence();
      setTimeout(cutSilence, 50);
    };
  }, 2900);
}

function runDemo() {
  if (running) return;
  running = true;
  var btn = document.getElementById('run-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" aria-hidden="true"></i> מעבד...';
  document.getElementById('spinner').classList.add('show');
  
  var st = document.getElementById('status-text');
  st.textContent = 'מנתח אודיו...';
  st.className = 'status-text active';

  var t = currentTab;
  var track = document.getElementById(t + '-cap-track');

  setTimeout(function() {
    st.textContent = 'מזהה דיבור בעברית...';
  }, 900);

  setTimeout(function() {
    st.textContent = 'יוצר כתוביות...';
  }, 1900);

  setTimeout(function() {
    track.style.opacity = '1';
    var cap1 = document.getElementById(t + '-cap1');
    if (cap1) { 
      cap1.style.opacity = '1'; 
    }
  }, 2600);

  setTimeout(function() {
    var cap2 = document.getElementById(t + '-cap2');
    if (cap2) { 
      cap2.style.opacity = '1'; 
    }
  }, 3100);

  setTimeout(function() {
    var cap3 = document.getElementById(t + '-cap3');
    if (cap3) { 
      cap3.style.opacity = '1'; 
    }
  }, 3600);

  setTimeout(function() {
    document.getElementById('spinner').classList.remove('show');
    st.textContent = '✓ כתוביות נוספו בהצלחה';
    st.className = 'status-text done';
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> הרץ שוב';
    running = false;
    btn.onclick = function() { 
      reset(); 
      setTimeout(runDemo, 50); 
    };
  }, 4200);
}
