// Personalised Diwali greeting
const nameInput = document.getElementById("nameInput");
const wishBtn = document.getElementById("wishBtn");
const fromLine = document.getElementById("fromLine");
const shareBtn = document.getElementById("shareBtn");
const surpriseBtn = document.getElementById("surpriseBtn");

function greetingText() {
  const name = nameInput.value.trim();
  return `${name ? `Dear ${name}, ` : ""}Wishing you and your family a very Happy Diwali 2026! May the festival of lights fill your life with happiness, peace, good health, prosperity and endless beautiful moments. Let your dreams shine bright. 🪔✨`;
}

wishBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  fromLine.textContent = name ? `A special Diwali wish, with love for ${name} ✨` : "With warm wishes, from your loved ones";
  document.querySelector(".hero-copy").textContent = name
    ? `Dear ${name}, may every diya light up a new hope and every moment bring you closer to happiness.`
    : "May the divine lights of Diwali bring endless joy, peace, prosperity and beautiful new beginnings into your life.";
});

shareBtn.addEventListener("click", () => {
  const url = `https://wa.me/?text=${encodeURIComponent(greetingText())}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

// Fireworks canvas
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let width, height, particles = [];
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * dpr; canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize); resize();

function burst(x = Math.random() * width, y = Math.random() * height * .55) {
  const colors = ["#ffd778", "#ff8d69", "#f9d6ff", "#9ee7dc", "#ffffff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 48; i++) {
    const angle = Math.PI * 2 * i / 48;
    const speed = 1 + Math.random() * 3.2;
    particles.push({x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 55+Math.random()*25, max: 80, color, size: 1+Math.random()*1.7});
  }
}
let tick = 0;
function animate() {
  ctx.clearRect(0, 0, width, height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += .025; p.vx *= .99; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (++tick % 95 === 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) burst();
  requestAnimationFrame(animate);
}
animate();

surpriseBtn.addEventListener("click", () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => burst(width * (.18 + Math.random() * .64), height * (.15 + Math.random() * .38)), i * 180);
  }
});

// A gentle, synthesized festive chime (no external audio file required)
let audioContext = null;
let soundTimer = null;
let soundOn = false;
const soundBtn = document.getElementById("soundBtn");
function chime() {
  if (!audioContext || !soundOn) return;
  const now = audioContext.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sine"; osc.frequency.value = freq;
    gain.gain.setValueAtTime(.0001, now + index * .16);
    gain.gain.exponentialRampToValueAtTime(.045, now + index * .16 + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, now + index * .16 + .7);
    osc.connect(gain); gain.connect(audioContext.destination);
    osc.start(now + index * .16); osc.stop(now + index * .16 + .75);
  });
}
soundBtn.addEventListener("click", async () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") await audioContext.resume();
  soundOn = !soundOn;
  soundBtn.setAttribute("aria-pressed", String(soundOn));
  soundBtn.innerHTML = soundOn ? "♫ <span>Sound is on · Turn off</span>" : "♫ <span>Play festive sound</span>";
  if (soundTimer) clearInterval(soundTimer);
  if (soundOn) { chime(); soundTimer = setInterval(chime, 2600); }
});
