
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];
let animationId = null;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const mouse = {
    x: null,
    y: null,
    radius: 150
};

const SETTINGS = {
    maxParticles: 75,
    particleSize: 1.5,
    connectionDistance: 110,
    particleColor: "210, 20, 50",
    connectionOpacity: 0.10,
    speed: 0.35
};

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();

    if (reducedMotion) {
        drawParticles();
    }
}

function createParticles() {
    particles = [];

    const amount = Math.min(
        SETTINGS.maxParticles,
        Math.floor((width * height) / 14000)
    );

    for (let i = 0; i < amount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * SETTINGS.particleSize + 0.5,
            speedX: (Math.random() - 0.5) * SETTINGS.speed,
            speedY: (Math.random() - 0.5) * SETTINGS.speed,
            opacity: Math.random() * 0.4 + 0.15,
            pulse: Math.random() * Math.PI * 2
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {

        if (!reducedMotion) {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.015;

            if (p.x < 0 || p.x > width) {
                p.speedX *= -1;
            }

            if (p.y < 0 || p.y > height) {
                p.speedY *= -1;
            }

            if (mouse.x !== null && mouse.y !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius && distance > 0) {
                    const force = (mouse.radius - distance) / mouse.radius;

                    p.x += (dx / distance) * force * 0.6;
                    p.y += (dy / distance) * force * 0.6;
                }
            }
        }

        const glow = p.opacity * (
            0.7 + Math.sin(p.pulse) * 0.3
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${SETTINGS.particleColor}, ${glow})`;

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#e21b40";

        ctx.fill();
        ctx.shadowBlur = 0;
    });

    drawConnections();

    if (!reducedMotion && !document.hidden) {
        animationId = requestAnimationFrame(drawParticles);
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {

            const p1 = particles[i];
            const p2 = particles[j];

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < SETTINGS.connectionDistance) {
                const opacity =
                    (1 - distance / SETTINGS.connectionDistance) *
                    SETTINGS.connectionOpacity;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);

                ctx.strokeStyle =
                    `rgba(${SETTINGS.particleColor}, ${opacity})`;

                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

window.addEventListener("mousemove", event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseout", event => {
    if (!event.relatedTarget) {
        mouse.x = null;
        mouse.y = null;
    }
});

window.addEventListener("touchstart", () => {
    mouse.x = null;
    mouse.y = null;
}, { passive: true });

window.addEventListener("resize", resizeCanvas);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    } else if (!reducedMotion) {
        if (animationId === null) {
            drawParticles();
        }
    }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }

    });

});

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const searchInput = document.getElementById("project-search");
const emptyMessage = document.getElementById("no-projects");
const projectCount = document.getElementById("project-count");

let activeFilter = "all";

function updateProjects() {

    const search = searchInput.value.toLowerCase().trim();

    let visibleCount = 0;

    projectCards.forEach(card => {

        const category = card.dataset.category;
        const name = card.dataset.name || "";
        const content = card.textContent.toLowerCase();

        const matchesFilter =
            activeFilter === "all" || category === activeFilter;

        const matchesSearch =
            name.includes(search) || content.includes(search);

        const visible = matchesFilter && matchesSearch;

        card.style.display = visible ? "flex" : "none";

        if (visible) {
            visibleCount++;
        }

    });

    emptyMessage.style.display =
        visibleCount === 0 ? "block" : "none";

    projectCount.textContent =
        `${String(projectCards.length).padStart(2, "0")} PROJECTS`;
}

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeFilter = button.dataset.filter;

        updateProjects();

    });

});

searchInput.addEventListener("input", updateProjects);

document.addEventListener("keydown", event => {

    if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(
            document.activeElement.tagName
        )
    ) {
        event.preventDefault();
        searchInput.focus();
    }

    if (event.key === "Escape") {
        searchInput.value = "";
        searchInput.blur();
        updateProjects();
    }

});

resizeCanvas();

if (!reducedMotion) {
    drawParticles();
}
