/* ════════════════════════════════════════
   كرت أفراح العريس أيهم — main.js
   ════════════════════════════════════════ */

/* ── 1. نجوم الخلفية ── */
function initStars() {
  const el = document.getElementById('stars');
  for (let i = 0; i < 140; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --dur:${2 + Math.random()*4}s;
      animation-delay:${Math.random()*6}s;
    `;
    el.appendChild(s);
  }
}

/* ── 2. شريط إعلاني ── */
function initTicker() {
  const wishes = [
    '🌹 ألف مبروك للعريس أيهم — بالرفاء والبنين',

    '✨ مبارك الزواج — ربنا يكتب لكم السعادة دائماً',
    '🌸 أيهم الغالي — الله يتمم بالخير ويبارك فيكم',
    '💛 ليلة بيضاء على العريس أيهم وعروسه الغالية',
    '🌺 بالتوفيق والهناء — ألف مبروك يا أيهم',
    '⭐ سعادة لا تنتهي وحياة مليانة فرح يا عريسنا',
    '🎊 أيهم — الله يجعلها بداية عمر جديد مليان بالبركة',
    '🕊 يا رب تكون أسعد الناس يا أيهم',
    '🎉 ننتظر الفرحة في مادبا الحي الشرقي — أهلاً وسهلاً بالجميع',
    '📣 تابعونا عن قريب لتحديد موعد العرس',
    '☎ للتواصل مع العريس: 0775884464',
  ];
  const track = document.getElementById('ticker');
  [...wishes, ...wishes].forEach(w => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.innerHTML = `${w}<span class="sep"> ✦ </span>`;
    track.appendChild(span);
  });
}

/* ── 3. تهاني ── */
function initCongrats() {
  const list = [
    'مبارك الزواج 💛','ألف مبروك 🌹','بالرفاء والبنين 🌸',
'ربنا يسعدكم 💍','يوم لا يُنسى 🌺',
    'أفراح متجددة 🎊','نعم الختيار ⭐','الله يبارك 🕊',
  ];
  const el = document.getElementById('congrats');
  list.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'congrats-tag';
    div.textContent = c;
    div.style.animationDelay = `${i * 0.15 + 0.3}s`;
    // نثر جزيئات عند الضغط
    div.addEventListener('click', () => spawnHearts(div));
    el.appendChild(div);
  });
}

/* ── 4. عداد تنازلي ── */
function initCountdown() {
  const eventDate = new Date('2026-11-20T19:00:00');
  const ids = { d: 'cd-d', h: 'cd-h', m: 'cd-m', s: 'cd-s' };

  function update() {
    const diff = eventDate - new Date();
    if (diff <= 0) {
      Object.values(ids).forEach(id => document.getElementById(id).textContent = '🎉');
      return;
    }
    const vals = {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
    Object.entries(vals).forEach(([k, v]) => {
      const el = document.getElementById(ids[k]);
      const str = String(v).padStart(2, '0');
      if (el.textContent !== str) {
        el.textContent = str;
        el.closest('.count-box').classList.remove('pulse');
        void el.closest('.count-box').offsetWidth; // reflow
        el.closest('.count-box').classList.add('pulse');
      }
    });
  }
  update();
  setInterval(update, 1000);
}

/* ── 5. ألعاب نارية بـ canvas ── */
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let fwInterval = null;
let fwActive = false;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const COLORS = [
  '#ffe680','#c9a84c','#ff9900','#ff4444','#ff88cc',
  '#88ffcc','#66aaff','#ffffff','#ffdd44','#ff6633',
];

class Particle {
  constructor(x, y, color, type = 'spark') {
    this.x = x; this.y = y;
    this.color = color;
    this.type = type;
    const angle = Math.random() * Math.PI * 2;
    const speed = type === 'trail' ? Math.random() * 2 + 1 : Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = type === 'trail' ? 0.015 : Math.random() * 0.02 + 0.012;
    this.size  = type === 'trail' ? Math.random() * 3 + 1 : Math.random() * 4 + 2;
    this.gravity = type === 'trail' ? 0.05 : 0.12;
  }
  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.vx *= 0.98;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.type === 'trail' ? 4 : 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function burst(x, y) {
  const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
  const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
  const count  = 80 + Math.floor(Math.random() * 60);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, i % 2 === 0 ? color1 : color2));
  }
  // حلقة ثانية أصغر
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(x, y, '#ffffff', 'trail'));
  }
}

function randomBurst() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.65;
  burst(x, y);
}

function animateFireworks() {
  if (!fwActive) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
    return;
  }
  ctx.fillStyle = 'rgba(26,16,0,0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateFireworks);
}

function startFireworks() {
  if (fwActive) return;
  fwActive = true;
  animateFireworks();
  // أول ثلاثة انفجارات فورية
  for (let i = 0; i < 3; i++) setTimeout(randomBurst, i * 300);
  fwInterval = setInterval(() => {
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) setTimeout(randomBurst, i * 200);
  }, 1200);
}

function stopFireworks() {
  fwActive = false;
  clearInterval(fwInterval);
}

function toggleFireworks() {
  const btn = document.getElementById('fw-btn');
  if (fwActive) {
    stopFireworks();
    btn.textContent = '🎆';
    btn.title = 'تشغيل الألعاب النارية';
  } else {
    startFireworks();
    btn.textContent = '🛑';
    btn.title = 'إيقاف الألعاب النارية';
  }
}

// تشغيل تلقائي عند فتح الصفحة لمدة 6 ثواني
window.addEventListener('load', () => {
  startFireworks();
  document.getElementById('fw-btn').textContent = '🛑';
  setTimeout(() => {
    if (fwActive) toggleFireworks();
  }, 6000);
});

/* ── 6. نثر قلوب عند الضغط على التهاني ── */
function spawnHearts(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  burst(cx, cy);
  if (!fwActive) {
    fwActive = true;
    animateFireworks();
    setTimeout(() => { fwActive = false; }, 2000);
  }
}

/* ── 8. popup ترحيبي ── */
function initWelcome() {
  const overlay = document.getElementById('welcomeOverlay');
  const btn     = document.getElementById('welcomeClose');

  function close() {
    overlay.classList.add('hide');
    setTimeout(() => overlay.remove(), 650);
  }

  btn.addEventListener('click', close);
  setTimeout(close, 7000);
}

/* ── 7. تشغيل الكل ── */
document.addEventListener('DOMContentLoaded', () => {
  initWelcome();
  initStars();
  initTicker();
  initCongrats();
  initCountdown();

  // زر الألعاب النارية
  document.getElementById('fw-btn').addEventListener('click', toggleFireworks);

  // انفجار عند النقر على أي مكان في الصفحة
  document.addEventListener('click', (e) => {
    if (e.target.closest('#fw-btn') || e.target.closest('.rsvp-btn') || e.target.closest('.call-btn')) return;
    burst(e.clientX, e.clientY);
    if (!fwActive) {
      fwActive = true;
      animateFireworks();
      setTimeout(() => { if (fwActive && !fwInterval) fwActive = false; }, 2000);
    }
  });
});
