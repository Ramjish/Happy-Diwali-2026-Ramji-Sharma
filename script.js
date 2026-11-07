// Diwali fireworks animation and WhatsApp sharing — Vanilla JavaScript
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let width = 0, height = 0, particles = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createFirework(x = Math.random() * width, y = Math.random() * height * 0.55) {
  const colors = ["#ffd778", "#ff8d69", "#f9d6ff", "#9ee7dc", "#ffffff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 52; i++) {
    const angle = (Math.PI * 2 * i) / 52;
    const speed = 1 + Math.random() * 3.4;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 65 + Math.random() * 20, maxLife: 85,
      color, size: 1 + Math.random() * 1.7
    });
  }
}

let frame = 0;
function animateFireworks() {
  ctx.clearRect(0, 0, width, height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.025;
    p.vx *= 0.99;
    p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (++frame % 100 === 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    createFirework();
  }
  requestAnimationFrame(animateFireworks);
}
animateFireworks();

document.getElementById("celebrateButton").addEventListener("click", () => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      createFirework(width * (0.12 + Math.random() * 0.76), height * (0.12 + Math.random() * 0.42));
    }, i * 170);
  }
});

document.getElementById("shareButton").addEventListener("click", () => {
  const message = "🪔✨ Happy Diwali 2026! ✨🪔\n\nआप सभी को दीपावली की हार्दिक शुभकामनाएँ!\n\nMay this Diwali bring happiness, good health, peace, prosperity and endless success to you and your family.\n\nWith warm wishes,\nRamji Sharma";
  const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(message);
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

// Gentle synthesized chime; audio starts only after the visitor presses the button.
let audioContext;
let soundInterval;
let isSoundOn = false;
const soundButton = document.getElementById("soundButton");

function playChime() {
  if (!audioContext || !isSoundOn) return;
  const start = audioContext.currentTime;
  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const time = start + index * 0.16;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    volume.gain.setValueAtTime(0.0001, time);
    volume.gain.exponentialRampToValueAtTime(0.04, time + 0.03);
    volume.gain.exponentialRampToValueAtTime(0.0001, time + 0.7);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.75);
  });
}

soundButton.addEventListener("click", async () => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      soundButton.textContent = "Audio not supported";
      return;
    }
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") await audioContext.resume();
  isSoundOn = !isSoundOn;
  soundButton.setAttribute("aria-pressed", String(isSoundOn));
  soundButton.innerHTML = isSoundOn ? "♫ <span>Sound is on · Turn off</span>" : "♫ <span>Play festive sound</span>";
  clearInterval(soundInterval);
  if (isSoundOn) {
    playChime();
    soundInterval = setInterval(playChime, 2800);
  }
});
