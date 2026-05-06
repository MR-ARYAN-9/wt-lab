// js/main.js - basic DOM helpers and form validation
document.addEventListener('DOMContentLoaded', function(){
  // nav toggle for mobile
  const btn = document.querySelector('.nav-toggle');
  if (btn) btn.addEventListener('click', ()=>{
    const nav = document.querySelector('.main-nav');
    if (nav.style.display === 'block') nav.style.display = '';
    else nav.style.display = 'block';
  });
  // initialize custom cursor on hover-capable devices
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    initCustomCursor();
  }
});

function validateRegister(){
  const f = document.getElementById('registerForm');
  const pw = f.password.value; const confirm = f.confirm.value;
  if (pw.length < 6){ alert('Password must be at least 6 characters.'); return false; }
  if (pw !== confirm){ alert('Passwords do not match.'); return false; }
  return true;
}

function validateLogin(){
  const f = document.getElementById('loginForm');
  if (!f.email.value || !f.password.value){ alert('Please fill email and password.'); return false; }
  return true;
}

function validateUpload(){
  const f = document.getElementById('uploadForm');
  const file = f.project_file.files[0];
  if (!file){ alert('Please select a file.'); return false; }
  const allowed = ['application/pdf','application/zip','application/x-zip-compressed'];
  if (!allowed.includes(file.type)) { alert('Only PDF or ZIP allowed.'); return false; }
  if (file.size > 10*1024*1024){ alert('File too large (max 10MB).'); return false; }
  return true;
}

function validateContact(){
  const f = document.getElementById('contactForm');
  if (!f.name.value || !f.email.value || !f.message.value){ alert('Please complete all fields.'); return false; }
  return true;
}

// Custom cursor implementation: small dot + ring that follow pointer smoothly
function initCustomCursor(){
  // create elements
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(ring); document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  const lerp = (a,b,t)=> a + (b-a)*t;

  window.addEventListener('mousemove', function(e){
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });

  window.addEventListener('mouseleave', ()=>{ dot.classList.add('cursor-hide'); ring.classList.add('cursor-hide'); });
  window.addEventListener('mouseenter', ()=>{ dot.classList.remove('cursor-hide'); ring.classList.remove('cursor-hide'); });

  // click pulse
  window.addEventListener('mousedown', ()=>{
    dot.style.transform = 'translate(-50%,-50%) scale(0.7)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.8)';
  });
  window.addEventListener('mouseup', ()=>{
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  // enlarge ring when hovering interactive elements
  const hoverTargets = document.querySelectorAll('a,button,input,textarea,.btn,.main-nav a');
  hoverTargets.forEach(t=>{
    t.addEventListener('mouseenter', ()=>{ ring.style.transform = 'translate(-50%,-50%) scale(1.6)'; });
    t.addEventListener('mouseleave', ()=>{ ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });

  // animation loop
  function render(){
    dotX = lerp(dotX, mouseX, 0.35);
    dotY = lerp(dotY, mouseY, 0.35);
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    dot.style.left = dotX + 'px'; dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

