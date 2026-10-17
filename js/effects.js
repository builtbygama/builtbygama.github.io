/* =========================================================
   EFFECTS: scroll progress, cursor glow, reveal on scroll,
   and small "[ SYSTEM ]" notifications as sections come into view.
   ========================================================= */

function initEffects() {

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- scroll progress line ---------- */
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);

    function progress() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", progress, { passive: true });
    progress();

    /* ---------- cursor glow (mouse devices only) ---------- */
    if (!reduce && window.matchMedia("(hover: hover)").matches) {
        const glow = document.createElement("div");
        glow.className = "cursor-glow";
        document.body.appendChild(glow);
        let x = -500, y = -500, tx = x, ty = y;
        window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
        (function move() {
            x += (tx - x) * 0.12; y += (ty - y) * 0.12;
            glow.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
            requestAnimationFrame(move);
        })();
    }

    /* ---------- reveal on scroll ---------- */
    const targets = document.querySelectorAll(
        ".skill-card, .stat-card, .status-window, .workflow-step, .contact-card, .contact-terminal, .about-text, .skills-header"
    );

    if (reduce || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
    }, { threshold: 0.12 });

    targets.forEach(function (el, i) {
        el.classList.add("reveal");
        el.style.setProperty("--d", (i % 4) * 90 + "ms");
        io.observe(el);
    });

    /* ---------- [ SYSTEM ] notifications ---------- */
    const box = document.createElement("div");
    box.id = "system-toasts";
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);

    function toast(text) {
        const t = document.createElement("div");
        t.className = "system-toast";
        t.innerHTML = "<b>[ SYSTEM ]</b><span>" + text + "</span>";
        while (box.children.length >= 2) box.firstChild.remove();   /* never stack more than 2 */
        box.appendChild(t);
        setTimeout(function () { t.remove(); }, 3400);
    }

    window.systemToast = toast;

    const messages = {
        about:    "Profile discovered.",
        skills:   "Skill tree unlocked.",
        projects: "Quest log opened.",
        workflow: "Strategy revealed.",
        contact:  "Gate open. Send a message."
    };

    setTimeout(function () { toast("Portfolio loaded. Welcome."); }, 900);

    const seen = {};
    const sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            const id = en.target.id;
            if (en.isIntersecting && !seen[id]) { seen[id] = true; toast(messages[id]); }
        });
    }, { threshold: 0.35 });

    Object.keys(messages).forEach(function (id) {
        const el = document.getElementById(id);
        if (el) sio.observe(el);
    });
}
