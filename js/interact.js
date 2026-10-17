/* =========================================================
   INTERACTIONS
   Sparkle trail, 3D card tilt, mouse parallax, a hero character
   that watches the cursor, confetti, and a Konami-code easter egg.
   ========================================================= */

function initInteract() {

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const root = document.documentElement;
    const COLORS = ["#ffd23f", "#ff6fb5", "#29b6f6", "#ffffff", "#7c5cff"];
    const pick = function () { return COLORS[Math.floor(Math.random() * COLORS.length)]; };

    /* ---------- confetti + party mode (used by terminal and Konami) ---------- */
    window.celebrate = function (big) {
        if (reduce) return;
        const n = big ? 90 : 60;
        for (let i = 0; i < n; i++) {
            const s = document.createElement("i");
            s.className = "confetti";
            s.style.cssText =
                "left:" + Math.random() * 100 + "vw;--c:" + pick() + ";--dx:" + ((Math.random() - 0.5) * 260) + "px;" +
                "--r:" + (Math.random() * 720) + "deg;width:" + (6 + Math.random() * 7) + "px;height:" + (8 + Math.random() * 10) + "px;" +
                "animation-duration:" + (1.8 + Math.random() * 1.6) + "s;animation-delay:" + Math.random() * 0.4 + "s";
            document.body.appendChild(s);
            setTimeout(function () { s.remove(); }, 4300);
        }
    };

    window.partyMode = function () {
        window.celebrate(true);
        document.body.classList.add("party");
        if (window.systemToast) window.systemToast("Party mode unlocked!");
        setTimeout(function () { document.body.classList.remove("party"); }, 6000);
    };

    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    document.addEventListener("keydown", function (e) {
        if (e.target.closest && e.target.closest("input, textarea")) return;
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
        if (pos === code.length) { pos = 0; window.partyMode(); }
    });

    if (reduce || !mouse) return;

    /* ---------- sparkle trail ---------- */
    let lastX = -99, lastY = -99, lastT = 0, live = 0;
    document.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        const now = performance.now();
        if (now - lastT < 35 || live > 36) return;
        if (Math.hypot(e.clientX - lastX, e.clientY - lastY) < 20) return;
        lastX = e.clientX; lastY = e.clientY; lastT = now;

        const s = document.createElement("i");
        s.className = "trail";
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.setProperty("--c", pick());
        s.style.setProperty("--s", (10 + Math.random() * 10) + "px");
        s.style.setProperty("--dx", ((Math.random() - 0.5) * 36) + "px");
        live++;
        s.addEventListener("animationend", function () { s.remove(); live--; });
        document.body.appendChild(s);
    });

    /* ---------- 3D card tilt ---------- */
    const TILT = ".skill-card, .project-card, .workflow-step, .contact-card, .status-window";
    document.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        const el = e.target.closest && e.target.closest(TILT);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * 12).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * 10).toFixed(2) + "deg");
    });
    document.addEventListener("pointerout", function (e) {
        const el = e.target.closest && e.target.closest(TILT);
        if (el && !el.contains(e.relatedTarget)) { el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); }
    });

    /* ---------- parallax ---------- */
    let mx = 0, my = 0, queued = false;
    document.addEventListener("pointermove", function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
            queued = false;
            root.style.setProperty("--mx", mx.toFixed(3));
            root.style.setProperty("--my", my.toFixed(3));
        });
    });
}
