
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 100;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.04;
        this.life--;
    }

    draw() {
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

function createFirework(x, y) {
    const colors = [
        "#ffd700",
        "#ff4500",
        "#00ffcc",
        "#ff69b4",
        "#ffffff"
    ];

    const color = colors[
        Math.floor(Math.random() * colors.length)
    ];

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    particles = particles.filter(
        particle => particle.life > 0
    );

    requestAnimationFrame(animate);
}

animate();

// Automatic fireworks
setInterval(() => {
    createFirework(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
    );
}, 1500);

// Celebrate button
document.getElementById("celebrateBtn")
    .addEventListener("click", () => {

        for (let i = 0; i < 5; i++) {
            createFirework(
                Math.random() * canvas.width,
                Math.random() * canvas.height * 0.6
            );
        }
    });

// WhatsApp sharing
document.getElementById("shareBtn")
    .addEventListener("click", () => {

        const message =
            "🪔 Happy Diwali 2026! 🎆\n\n" +
            "May your life shine with happiness, " +
            "success and prosperity.\n\n" +
            "Best Wishes - Ramji Sharma ❤️";

        const url =
            "https://wa.me/?text=" +
            encodeURIComponent(message);

        window.open(url, "_blank");
    });
