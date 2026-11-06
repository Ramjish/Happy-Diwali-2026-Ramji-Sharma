
const canvas = document.getElementById("celebrationCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const colors = [
    "#FFD700",
    "#FFA500",
    "#FF4500",
    "#FFF2B2",
    "#FF69B4",
    "#FFFFFF"
];

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.alpha = 1;
        this.size = Math.random() * 3 + 1;
        this.gravity = 0.035;
        this.decay = Math.random() * 0.012 + 0.006;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += this.gravity;
        this.vx *= 0.99;

        this.alpha -= this.decay;
    }

    draw() {
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function createFirework(x, y) {
    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];

    for (let i = 0; i < 65; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    particles = particles.filter(
        particle => particle.alpha > 0
    );

    animationFrame = requestAnimationFrame(animate);
}

animate();

// Automatic fireworks
let automaticFireworks = setInterval(() => {
    createFirework(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.55
    );
}, 1800);

// Celebrate button
document.getElementById("celebrateBtn")
    .addEventListener("click", () => {

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height * 0.65
                );
            }, i * 250);
        }
    });

// WhatsApp sharing
document.getElementById("shareBtn")
    .addEventListener("click", () => {

        const website = window.location.href;

        const message =
            "🪔✨ Happy Dhanteras 2026! ✨🪔\n\n" +
            "May Goddess Lakshmi bless your home " +
            "with wealth, happiness, prosperity and good health.\n\n" +
            "May your life shine with success and endless blessings.\n\n" +
            "🙏 शुभ धनतेरस 🙏\n\n" +
            "With Best Wishes,\n" +
            "❤️ Ramji Sharma ❤️\n\n" +
            "Celebrate here: " + website;

        const whatsappURL =
            "https://wa.me/?text=" +
            encodeURIComponent(message);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });

// Clean up when leaving page
window.addEventListener("pagehide", () => {
    clearInterval(automaticFireworks);
    cancelAnimationFrame(animationFrame);
});
