/* =========================================================
   SHADOW BACKGROUND
   Drifting fog, slowly turning rune circles, rising embers.
   ========================================================= */

function initShadowBackground() {

    const mount = document.getElementById("background-doodles");
    if (!mount) return;

    const rune =
        '<svg class="rune" viewBox="-200 -200 400 400" aria-hidden="true">' +
        '<g class="rune-a"><circle r="192" stroke-width="1.5"/><circle r="180" stroke-dasharray="2 9"/>' +
        '<circle r="152"/><circle r="146" stroke-dasharray="14 6 3 6"/></g>' +
        '<g class="rune-b"><rect x="-86" y="-86" width="172" height="172"/>' +
        '<rect x="-86" y="-86" width="172" height="172" transform="rotate(45)"/>' +
        '<circle r="120" stroke-dasharray="1 7"/><circle r="64"/></g>' +
        '<circle r="5" class="rune-core"/></svg>';

    mount.innerHTML =
        '<div class="fog fog-1"></div><div class="fog fog-2"></div>' +
        rune + '<canvas id="embers"></canvas><div class="vignette"></div>';

    const canvas = document.getElementById("embers");
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const COUNT = window.innerWidth < 700 ? 28 : 70;
    let w, h, parts = [], running = true;

    function size() {
        const r = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * r; canvas.height = h * r;
        canvas.style.width = w + "px"; canvas.style.height = h + "px";
        ctx.setTransform(r, 0, 0, r, 0, 0);
    }

    function spawn(anywhere) {
        return {
            x: Math.random() * w,
            y: anywhere ? Math.random() * h : h + 10,
            r: 0.8 + Math.random() * 2.2,
            vy: 0.25 + Math.random() * 0.7,
            sway: Math.random() * Math.PI * 2,
            swaySpeed: 0.004 + Math.random() * 0.01,
            life: Math.random(),
            blue: Math.random() < 0.18
        };
    }

    function reset() { parts = []; for (let i = 0; i < COUNT; i++) parts.push(spawn(true)); }

    function frame() {
        ctx.clearRect(0, 0, w, h);
        const light = document.body.classList.contains("light");
        ctx.globalCompositeOperation = light ? "source-over" : "lighter";

        parts.forEach(function (p, i) {
            if (!reduce) {
                p.y -= p.vy; p.sway += p.swaySpeed; p.x += Math.sin(p.sway) * 0.35;
                p.life += 0.003;
            }
            if (p.y < -10) parts[i] = spawn(false);

            const fade = Math.min(1, (h - p.y) / 120, p.y / 160 + 0.2);
            const a = Math.max(0, fade) * (0.35 + 0.35 * Math.sin(p.life * 6));
            const c = p.blue ? "56,189,248" : (light ? "109,40,217" : "167,139,250");

            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
            g.addColorStop(0, "rgba(" + c + "," + a + ")");
            g.addColorStop(1, "rgba(" + c + ",0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.2832); ctx.fill();
        });
    }

    function loop() { if (!running) return; frame(); requestAnimationFrame(loop); }

    size(); reset();
    window.addEventListener("resize", function () { size(); reset(); });

    if (reduce) { frame(); return; }

    document.addEventListener("visibilitychange", function () {
        running = !document.hidden;
        if (running) requestAnimationFrame(loop);
    });
    requestAnimationFrame(loop);
}
