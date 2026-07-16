var currentTab = 'pr';
var running = false;

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