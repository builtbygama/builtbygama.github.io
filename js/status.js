/* =========================================================
   ENGINEER STATUS WINDOW  (About section)
   Everything below the profile is computed live from the
   `projects` array in projects.js, so it can never go stale.
   Edit PROFILE to change the identity lines.
   ========================================================= */

const PROFILE = {
    name:  "Gaddam Madhukanth",
    role:  "Cloud & DevOps Engineer",
    focus: "Infrastructure \u00B7 Automation \u00B7 Reliability"
};

function initStatusWindow() {

    const box = document.getElementById("statusWindow");
    if (!box || typeof projects === "undefined") return;

    const esc = function (t) {
        return String(t).replace(/[&<>"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    };

    const isDone = function (p) { return /complete/i.test(p.status || ""); };
    const done = projects.filter(isDone);
    const planned = projects.length - done.length;

    const allTech = {};
    projects.forEach(function (p) { (p.technologies || []).forEach(function (t) { allTech[t] = true; }); });

    /* tool usage across COMPLETED projects only */
    const usage = {};
    done.forEach(function (p) {
        const seen = {};
        (p.technologies || []).forEach(function (t) {
            if (!seen[t]) { usage[t] = (usage[t] || 0) + 1; seen[t] = true; }
        });
    });

    const top = Object.keys(usage)
        .sort(function (a, b) { return usage[b] - usage[a] || a.localeCompare(b); })
        .slice(0, 7);
    const max = top.length ? usage[top[0]] : 1;

    const counters = [
        [done.length, "Projects built"],
        [planned, "In planning"],
        [Object.keys(allTech).length, "Technologies"]
    ];

    box.innerHTML =
        '<div class="sw-head"><span class="sw-tag">[ STATUS ]</span><span class="sw-sub">Engineer profile</span></div>' +
        '<dl class="sw-id">' +
            '<div><dt>Name</dt><dd>' + esc(PROFILE.name) + '</dd></div>' +
            '<div><dt>Class</dt><dd>' + esc(PROFILE.role) + '</dd></div>' +
            '<div><dt>Focus</dt><dd>' + esc(PROFILE.focus) + '</dd></div>' +
        '</dl>' +
        '<div class="sw-counters">' +
            counters.map(function (c) {
                return '<div><strong data-count="' + c[0] + '">0</strong><span>' + c[1] + '</span></div>';
            }).join("") +
        '</div>' +
        '<h4 class="sw-title">Tool XP <small>used across completed projects</small></h4>' +
        '<ul class="sw-bars">' +
            top.map(function (t, i) {
                const w = Math.max(14, Math.round((usage[t] / max) * 100));
                return '<li><button type="button" data-tech="' + esc(t) + '" style="--w:' + w + '%;--i:' + i + '" aria-label="' +
                    esc(t) + ', used in ' + usage[t] + ' projects. Show these projects">' +
                    '<span class="sw-name">' + esc(t) + '</span>' +
                    '<span class="sw-track"><i></i></span>' +
                    '<span class="sw-val">' + usage[t] + '</span></button></li>';
            }).join("") +
        '</ul>' +
        '<p class="sw-hint">Tap a tool to see the projects that use it</p>';

    /* click a bar: filter the projects grid, then scroll there */
    box.addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-tech]");
        if (!btn) return;
        const tech = btn.getAttribute("data-tech").toLowerCase();
        const filters = document.querySelectorAll(".project-filter");
        for (let i = 0; i < filters.length; i++) {
            if (filters[i].textContent.trim().toLowerCase() === tech) { filters[i].click(); break; }
        }
        const target = document.getElementById("projects");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    /* animate in when it scrolls into view */
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function play() {
        box.classList.add("on");
        box.querySelectorAll("[data-count]").forEach(function (el) {
            const end = +el.getAttribute("data-count");
            if (reduce || end === 0) { el.textContent = end; return; }
            let n = 0;
            const step = Math.max(1, Math.ceil(end / 14));
            const id = setInterval(function () {
                n = Math.min(end, n + step);
                el.textContent = n;
                if (n >= end) clearInterval(id);
            }, 60);
        });
    }

    if (reduce || !("IntersectionObserver" in window)) { play(); return; }

    const io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { play(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(box);
}
