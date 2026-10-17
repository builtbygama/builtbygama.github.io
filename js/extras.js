/* =========================================================
   EXTRAS: site-wide interactions + shared helpers
   - Tool pop-ups (what projects use this tool?)
   - "Run the pipeline" in the workflow section
   - Resume download that fails gracefully
   - Placeholder links never jump the page
   - Magnetic buttons
   Shared helpers live on window.Gama for the assistant + palette.
   ========================================================= */

window.Gama = (function () {

    const $ = function (s, r) { return (r || document).querySelector(s); };
    const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    const isDone = function (p) { return /complete/i.test(p.status || ""); };
    const getProjects = function () { return typeof projects !== "undefined" ? projects : []; };

    /* "Remote State" even when the chip also holds a decorative symbol or icon */
    function chipName(chip) {
        const c = chip.cloneNode(true);
        c.querySelectorAll(".mini-symbol, i, svg, img").forEach(function (n) { n.remove(); });
        return c.textContent.replace(/\s+/g, " ").trim();
    }

    function toast(msg) {
        if (window.systemToast) { window.systemToast(msg); return; }
        /* fallback (reduced-motion mode has no animated toasts): a plain status line */
        let box = document.getElementById("gama-status");
        if (!box) {
            box = document.createElement("div");
            box.id = "gama-status";
            box.className = "gama-status";
            box.setAttribute("role", "status");
            document.body.appendChild(box);
        }
        box.textContent = msg;
        box.classList.add("show");
        clearTimeout(box._t);
        box._t = setTimeout(function () { box.classList.remove("show"); }, 3200);
    }

    function go(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    /* tool name -> { name, list: [projects] }, from project data + skills chips */
    function techIndex() {
        const map = {};
        getProjects().forEach(function (p) {
            (p.technologies || []).forEach(function (t) {
                const k = t.toLowerCase();
                (map[k] = map[k] || { name: t, list: [] }).list.push(p);
            });
        });
        $$(".skill-icon-item").forEach(function (chip) {
            const t = chipName(chip);
            if (t && !map[t.toLowerCase()]) map[t.toLowerCase()] = { name: t, list: [] };
        });
        return map;
    }

    function applyFilter(name) {
        const wanted = String(name || "").toLowerCase();
        const buttons = $$(".project-filter");
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent.trim().toLowerCase() === wanted) { buttons[i].click(); return true; }
        }
        return false;
    }

    function flashProject(title) {
        go("projects");
        setTimeout(function () {
            const cards = $$(".project-card");
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].textContent.toLowerCase().indexOf(String(title).toLowerCase()) !== -1) {
                    cards[i].scrollIntoView({ behavior: "smooth", block: "center" });
                    cards[i].classList.add("flash");
                    setTimeout(function (c) { c.classList.remove("flash"); }, 2200, cards[i]);
                    return;
                }
            }
        }, 450);
    }

    function contact() {
        const mail = $('a[href^="mailto:"]');
        const email = mail ? mail.getAttribute("href").replace("mailto:", "") : "";
        const links = $$('.contact-card[href^="http"]');
        const github = (links.filter(function (a) { return /github/i.test(a.href); })[0] || {}).href || "";
        const linkedin = (links.filter(function (a) { return /linkedin/i.test(a.href); })[0] || {}).href || "";
        return { email: /example\.com/.test(email) ? "" : email, github: github, linkedin: linkedin };
    }

    function copy(text, label) {
        const done = function () { toast((label || "Text") + " copied."); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { toast("Couldn't copy."); });
        else toast("Couldn't copy.");
    }

    async function openResume() {
        const a = $("[data-resume]");
        const url = a ? a.getAttribute("href") : "assets/resume.pdf";
        try {
            const r = await fetch(url, { method: "HEAD" });
            if (!r.ok) throw new Error("missing");
            const t = document.createElement("a");
            t.href = url; t.download = ""; document.body.appendChild(t); t.click(); t.remove();
        } catch (e) {
            toast("Resume not added yet. Put the PDF at assets/resume.pdf");
        }
    }

    return { chipName: chipName, $: $, $$: $$, isDone: isDone, getProjects: getProjects, toast: toast, go: go, techIndex: techIndex,
             applyFilter: applyFilter, flashProject: flashProject, contact: contact, copy: copy, openResume: openResume };
})();

function initExtras() {

    const G = window.Gama;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---------- resume button ---------- */
    document.addEventListener("click", function (e) {
        const a = e.target.closest("[data-resume]");
        if (a) { e.preventDefault(); G.openResume(); }
    });

    /* ---------- placeholder links (href="#") never jump to top ---------- */
    G.$$('a[href="#"]').forEach(function (a) {
        a.classList.add("is-placeholder");
        a.addEventListener("click", function (e) { e.preventDefault(); G.toast("This link hasn't been added yet."); });
    });

    /* ---------- tool pop-ups ---------- */
    const index = G.techIndex();
    const pop = document.createElement("div");
    pop.className = "chip-pop";
    pop.setAttribute("role", "tooltip");
    pop.hidden = true;
    document.body.appendChild(pop);

    function showPop(chip) {
        const name = G.chipName(chip);
        const hit = index[name.toLowerCase()];
        const done = hit ? hit.list.filter(G.isDone) : [];
        let body;
        if (done.length) {
            body = "<b>" + name + "</b><span>Used in " + done.length + " completed project" + (done.length > 1 ? "s" : "") + ":</span><ul>" +
                done.slice(0, 3).map(function (p) { return "<li>" + p.title.replace(/</g, "&lt;") + "</li>"; }).join("") + "</ul><em>Click to filter projects</em>";
        } else {
            body = "<b>" + name + "</b><span>Part of my toolkit. Not in a completed project yet.</span>";
        }
        pop.innerHTML = body;
        pop.hidden = false;
        const r = chip.getBoundingClientRect();
        const pw = pop.offsetWidth, ph = pop.offsetHeight;
        let x = Math.min(window.innerWidth - pw - 10, Math.max(10, r.left + r.width / 2 - pw / 2));
        let y = r.top - ph - 12;
        if (y < 10) y = r.bottom + 12;
        pop.style.left = x + "px";
        pop.style.top = y + "px";
    }

    function hidePop() { pop.hidden = true; }

    G.$$(".skill-icon-item").forEach(function (chip) {
        chip.setAttribute("tabindex", "0");
        chip.setAttribute("role", "button");
        chip.addEventListener("mouseenter", function () { showPop(chip); });
        chip.addEventListener("mouseleave", hidePop);
        chip.addEventListener("focus", function () { showPop(chip); });
        chip.addEventListener("blur", hidePop);
        chip.addEventListener("click", function () {
            hidePop();
            const label = G.chipName(chip);
            const ok = G.applyFilter(label);
            G.go("projects");
            if (!ok) G.toast("No project filter for " + label + " yet.");
        });
        chip.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chip.click(); } });
    });
    window.addEventListener("scroll", hidePop, { passive: true });

    /* ---------- run the pipeline (workflow section) ---------- */
    const header = G.$(".workflow-header");
    const steps = G.$$(".workflow-step");
    if (header && steps.length) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-primary wf-run";
        btn.innerHTML = "<span aria-hidden=\"true\">&#9654;</span> Run the pipeline";
        header.appendChild(btn);

        let running = false;
        btn.addEventListener("click", async function () {
            if (running) return;
            running = true;
            btn.disabled = true;
            steps.forEach(function (s) { s.classList.remove("wf-active", "wf-done"); });
            const wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? 120 : ms); }); };

            for (let i = 0; i < steps.length; i++) {
                steps[i].classList.add("wf-active");
                G.toast("Stage " + (i + 1) + "/" + steps.length + ": " + (steps[i].querySelector(".workflow-label") ? steps[i].querySelector(".workflow-label").textContent.trim() : "running"));
                await wait(750);
                steps[i].classList.remove("wf-active");
                steps[i].classList.add("wf-done");
            }
            G.toast("Pipeline succeeded.");
            if (window.celebrate) window.celebrate();
            await wait(1800);
            btn.disabled = false;
            running = false;
        });
    }

    /* ---------- magnetic buttons ---------- */
    if (mouse && !reduce) {
        document.addEventListener("pointermove", function (e) {
            const b = e.target.closest && e.target.closest(".btn");
            if (!b) return;
            const r = b.getBoundingClientRect();
            b.style.setProperty("--bx", ((e.clientX - (r.left + r.width / 2)) * 0.18).toFixed(1) + "px");
            b.style.setProperty("--by", ((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1) + "px");
        });
        document.addEventListener("pointerout", function (e) {
            const b = e.target.closest && e.target.closest(".btn");
            if (b && !b.contains(e.relatedTarget)) { b.style.removeProperty("--bx"); b.style.removeProperty("--by"); }
        });
    }
}
