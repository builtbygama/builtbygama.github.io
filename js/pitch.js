/* =========================================================
   PITCH: the portfolio talks to the visitor (text only).
   1. A rotating first-person line in the hero.
   2. A small speech bubble that comments as each section is
      reached (once each, dismissible, and mutable with "Hush").
   3. One exit-intent line on desktop.
   Edit the wording in HERO_LINES and SECTION_LINES below.
   ========================================================= */

const HERO_LINES = [
    "Your next DevOps hire is already here.",
    "I automate the boring parts so your team ships faster.",
    "Every skill on this page is backed by a real project.",
    "Hire me. Your pipelines will thank you."
];

const SECTION_LINES = {
    home: ["Hi! I'm the voice of this portfolio. Short version: Gama automates cloud work so teams ship faster.", "tour"],
    about: ["He learns by building, and every skill here is backed by a real project. That's the kind of engineer worth interviewing.", "why"],
    skills: ["AWS, Terraform, Docker, Kubernetes, CI/CD: the stack DevOps teams ask for. Hover any tool to see the proof.", null],
    projects: ["Open any project. Each has a real pipeline, a real design and a story he can walk you through.", null],
    workflow: ["This is how he works: plan, build, automate, observe, improve. Picture that discipline on your team.", "pipeline"],
    contact: ["Okay, last nudge. The best time to hire Gama was yesterday. The second best time is right now.", "hello"],
    exit: ["Leaving already? One message could start something good.", "hello"]
};

function initPitch() {

    const G = window.Gama;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

    /* ---------- 1. rotating hero line ---------- */
    const desc = G.$(".hero-description");
    if (desc && !G.$(".hero-pitch")) {
        const p = document.createElement("p");
        p.className = "hero-pitch";
        p.innerHTML = '<span class="sr-only">' + HERO_LINES[0] + '</span>' +
            '<span class="hp-live" aria-hidden="true"><span class="hp-text"></span><i class="hp-caret"></i></span>';
        desc.insertAdjacentElement("afterend", p);

        const out = p.querySelector(".hp-text");
        if (reduce) { out.textContent = HERO_LINES[0]; }
        else {
            (async function loop() {
                let i = 0;
                while (document.body.contains(out)) {
                    const line = HERO_LINES[i++ % HERO_LINES.length];
                    for (let c = 1; c <= line.length; c++) { out.textContent = line.slice(0, c); await sleep(34); }
                    await sleep(2600);
                    for (let c = line.length; c >= 0; c--) { out.textContent = line.slice(0, c); await sleep(14); }
                    await sleep(250);
                }
            })();
        }
    }

    /* ---------- 2. speech bubble ---------- */
    let muted = false;
    try { muted = localStorage.getItem("gama-pitch-muted") === "1"; } catch (e) {}
    let seen = {};
    try { seen = JSON.parse(sessionStorage.getItem("gama-pitch-seen") || "{}"); } catch (e) {}

    const box = document.createElement("div");
    box.className = "pitch";
    box.hidden = true;
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
    box.innerHTML =
        '<button type="button" class="pitch-x" aria-label="Dismiss">&times;</button>' +
        '<p class="pitch-text"></p>' +
        '<div class="pitch-actions"></div>' +
        '<button type="button" class="pitch-hush">Hush these tips</button>';
    document.body.appendChild(box);

    const textEl = box.querySelector(".pitch-text");
    const actionsEl = box.querySelector(".pitch-actions");
    let visible = false, lastShown = -1e9, hideTimer = null, token = 0, hovering = false;

    function hello() {
        const c = G.contact();
        if (c.email) { location.href = "mailto:" + c.email; return; }
        G.go("contact");
        G.toast(c.github ? "Say hi on GitHub, or use the contact cards." : "Use the contact cards below.");
    }

    const ACTIONS = {
        tour:     { label: "Take the 30s tour", run: function () { if (window.GamaAssistant) window.GamaAssistant.tour(); } },
        why:      { label: "Why hire Gama?",    run: function () { if (window.GamaAssistant) window.GamaAssistant.ask("Why hire Gama?"); } },
        pipeline: { label: "Run the pipeline",  run: function () { const b = G.$(".wf-run"); if (b) b.click(); } },
        hello:    { label: "Say hello",         run: hello }
    };

    function hide() {
        visible = false; box.hidden = true; lastShown = performance.now();
        clearTimeout(hideTimer); token++;
    }

    function blocked() {
        const asst = window.GamaAssistant && window.GamaAssistant.isOpen && window.GamaAssistant.isOpen();
        const pal = G.$(".pal") && !G.$(".pal").hidden;
        return muted || visible || asst || pal || document.hidden || document.getElementById("loader") ||
               performance.now() - lastShown < 7000;
    }

    async function show(key) {
        if (seen[key] || blocked()) return false;
        const item = SECTION_LINES[key];
        if (!item) return false;

        seen[key] = 1;
        try { sessionStorage.setItem("gama-pitch-seen", JSON.stringify(seen)); } catch (e) {}

        visible = true;
        const mine = ++token;
        actionsEl.innerHTML = "";
        textEl.textContent = "";
        box.hidden = false;

        const words = item[0].split(" ");
        if (reduce) textEl.textContent = item[0];
        else {
            for (let i = 0; i < words.length; i++) {
                if (mine !== token) return true;
                textEl.textContent += (i ? " " : "") + words[i];
                await sleep(30);
            }
        }
        if (mine !== token) return true;

        const act = item[1] && ACTIONS[item[1]];
        if (act) {
            const b = document.createElement("button");
            b.type = "button"; b.textContent = act.label;
            b.addEventListener("click", function () { hide(); act.run(); });
            actionsEl.appendChild(b);
        }

        (function arm() {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(function () { if (hovering) arm(); else hide(); }, 7500);
        })();
        return true;
    }

    box.addEventListener("mouseenter", function () { hovering = true; });
    box.addEventListener("mouseleave", function () { hovering = false; });
    box.querySelector(".pitch-x").addEventListener("click", hide);
    box.querySelector(".pitch-hush").addEventListener("click", function () {
        muted = true;
        try { localStorage.setItem("gama-pitch-muted", "1"); } catch (e) {}
        hide();
        G.toast("Okay, I'll stay quiet. The assistant is still here if you need it.");
    });
    window.addEventListener("asst:open", hide);

    /* section watcher: must stay in view for a moment before the bubble speaks */
    const inView = {};
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                const id = en.target.id;
                inView[id] = en.isIntersecting;
                if (en.isIntersecting && !seen[id]) {
                    setTimeout(function () { if (inView[id]) show(id); }, 1400);
                }
            });
        }, { threshold: 0.5 });
        ["about", "skills", "projects", "workflow", "contact"].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) io.observe(el);
        });
    }

    /* the opening line, a few seconds after the loader leaves */
    function opening() { setTimeout(function () { if (window.scrollY < 200) show("home"); }, 3500); }
    if (document.getElementById("loader")) window.addEventListener("loader:done", opening, { once: true });
    else opening();

    /* exit intent (desktop mice only): once, after the visitor has really looked around */
    const t0 = performance.now();
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.documentElement.addEventListener("mouseleave", function (e) {
            if (e.clientY <= 0 && performance.now() - t0 > 20000 && window.scrollY > 600) show("exit");
        });
    }

    window.GamaPitch = {
        mute: function () {
            muted = true;
            try { localStorage.setItem("gama-pitch-muted", "1"); } catch (e) {}
            hide();
        },
        toggle: function () {
            muted = !muted;
            try { localStorage.setItem("gama-pitch-muted", muted ? "1" : "0"); } catch (e) {}
            if (muted) hide();
            G.toast(muted ? "Pitch tips are off." : "Pitch tips are on.");
            return !muted;
        }
    };
}
