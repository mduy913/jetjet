const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const floatParticles = [];
const burstParticles = [];
const FLOAT_COUNT = 140;

const BLUE_SHADES = [
    "#3b82f6",
    "#60a5fa",
    "#93c5fd",
    "#2563eb",
    "#bfdbfe",
    "#1d4ed8"
];

class Particle {
    constructor(x, y, type = 'float') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = Math.random() * 2 + 1;
        this.color = BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)];
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.maxLife = Math.random() * 100 + 50;
        this.life = type === 'float' ? Math.random() * this.maxLife : this.maxLife;
        this.opacity = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
        this.opacity = this.life / this.maxLife;

        if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            if (this.type === 'float') {
                this.reset();
            }
        }
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vy = -(Math.random() * 1.5 + 0.5);
        this.vx = (Math.random() - 0.5) * 1;
        this.life = this.maxLife;
        this.opacity = 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

function spawnHeartBurst(x, y) {
    const count = 140;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));

        const p = new Particle(x, y, 'burst');
        p.vx = heartX * 0.2;
        p.vy = heartY * 0.2;
        p.maxLife = 80;
        p.life = p.maxLife;
        burstParticles.push(p);
    }
}

for (let i = 0; i < FLOAT_COUNT; i++) {
    const p = new Particle(
        Math.random() * width,
        Math.random() * height,
        "float"
    );
    p.life = Math.random() * p.maxLife;
    floatParticles.push(p);
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    floatParticles.forEach(p => {
        p.update();
        p.draw();
    });

    for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.update();
        p.draw();
        
        if (p.life <= 0) {
            burstParticles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

document.getElementById('buyBtn').addEventListener('click', function(e) {
    spawnHeartBurst(e.clientX, e.clientY);
});

setInterval(() => {
    spawnHeartBurst(width / 2, height / 2);
}, 4000);

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
