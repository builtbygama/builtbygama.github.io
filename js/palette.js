/* =========================================================
   COMMAND PALETTE  (Ctrl/Cmd + K, or "/")
   Jump to sections, open projects, and run quick actions.
   ========================================================= */

function initPalette() {

    const G = window.Gama;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const root = document.createElement("div");
    root.className = "pal";
    root.hidden = true;
    root.innerHTML =
        '<div class="pal-backdrop" data-close></div>' +
        '<div class="pal-box" role="dialog" aria-modal="true" aria-label="Command palette">' +
            '<div class="pal-head"><span class="pal-k" aria-hidden="true">&gt;</span>' +
            '<input class="pal-input" type="text" autocomplete="off" spellcheck="false" placeholder="Jump to a section, project or action..." aria-label="Search commands">' +
            '<kbd>Esc</kbd></div>' +
            '<ul class="pal-list" role="listbox" aria-label="Results"></ul>' +
            '<div class="pal-foot"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate</span><span><kbd>Enter</kbd> select</span></div>' +
        '</div>';
    document.body.appendChild(root);

    const input = root.querySelector(".pal-input");
    const list = root.querySelector(".pal-list");
    let items = [], shown = [], sel = 0, lastFocus = null;

    function build() {
        const out = [];
        [["home", "Home"], ["about", "About"], ["skills", "Skills"], ["projects", "Projects"], ["workflow", "Workflow"], ["contact", "Contact"]]
            .forEach(function (s) { out.push({ group: "Go to", label: s[1], hint: "section", run: function () { G.go(s[0]); } }); });

        G.getProjects().forEach(function (p) {
            out.push({ group: "Projects", label: p.title, hint: G.isDone(p) ? "completed" : "planned", keys: (p.technologies || []).join(" "),
                run: function () { G.flashProject(p.title); } });
        });

        const c = G.contact();
        out.push({ group: "Actions", label: "Toggle theme", hint: "dark / light", run: function () { const t = document.getElementById("themeToggle"); if (t) t.click(); } });
        out.push({ group: "Actions", label: "Why hire Gama?", hint: "the pitch", keys: "best convince strengths", run: function () { if (window.GamaAssistant) window.GamaAssistant.ask("Why hire Gama?"); } });
        out.push({ group: "Actions", label: "Ask the assistant", hint: "chat", run: function () { if (window.GamaAssistant) window.GamaAssistant.open(); } });
        out.push({ group: "Actions", label: "Take a quick tour", hint: "guided", run: function () { if (window.GamaAssistant) window.GamaAssistant.tour(); } });
        out.push({ group: "Actions", label: "Download CV", hint: "pdf", run: function () { G.openResume(); } });
        if (c.github) out.push({ group: "Links", label: "Open GitHub", hint: "new tab", run: function () { window.open(c.github, "_blank", "noopener"); } });
        if (c.linkedin) out.push({ group: "Links", label: "Open LinkedIn", hint: "new tab", run: function () { window.open(c.linkedin, "_blank", "noopener"); } });
        if (c.email) {
            out.push({ group: "Links", label: "Send an email", hint: c.email, run: function () { location.href = "mailto:" + c.email; } });
            out.push({ group: "Links", label: "Copy email address", hint: c.email, run: function () { G.copy(c.email, "Email"); } });
        }
        out.push({ group: "Actions", label: "Toggle pitch tips", hint: "speech bubbles", run: function () { if (window.GamaPitch) window.GamaPitch.toggle(); } });
        out.push({ group: "Fun", label: "Party mode", hint: "confetti", run: function () { if (window.partyMode) window.partyMode(); } });
        return out;
    }

    function render() {
        const q = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        shown = items.filter(function (it) {
            const hay = (it.label + " " + it.hint + " " + it.group + " " + (it.keys || "")).toLowerCase();
            return q.every(function (t) { return hay.indexOf(t) !== -1; });
        }).slice(0, 9);
        if (sel >= shown.length) sel = Math.max(0, shown.length - 1);

        list.innerHTML = "";
        if (!shown.length) { list.innerHTML = '<li class="pal-empty">No matches. Try "projects" or "theme".</li>'; return; }

        let last = "";
        shown.forEach(function (it, i) {
            if (it.group !== last) {
                const h = document.createElement("li");
                h.className = "pal-group"; h.setAttribute("role", "presentation"); h.textContent = it.group;
                list.appendChild(h); last = it.group;
            }
            const li = document.createElement("li");
            li.className = "pal-item" + (i === sel ? " on" : "");
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", i === sel ? "true" : "false");
            li.innerHTML = '<span></span><small></small>';
            li.firstChild.textContent = it.label;
            li.lastChild.textContent = it.hint;
            li.addEventListener("mousemove", function () { if (sel !== i) { sel = i; render(); } });
            li.addEventListener("click", function () { choose(i); });
            list.appendChild(li);
        });
        const on = list.querySelector(".on");
        if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest" });
    }

    function open() {
        if (!root.hidden) return;
        lastFocus = document.activeElement;
        items = build(); sel = 0; input.value = "";
        root.hidden = false;
        document.documentElement.classList.add("pal-open");
        render();
        input.focus();
    }

    function close() {
        if (root.hidden) return;
        root.hidden = true;
        document.documentElement.classList.remove("pal-open");
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function choose(i) {
        const it = shown[i];
        if (!it) return;
        close();
        setTimeout(it.run, reduce ? 0 : 120);
    }

    input.addEventListener("input", function () { sel = 0; render(); });
    input.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); render(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); render(); }
        else if (e.key === "Enter") { e.preventDefault(); choose(sel); }
        else if (e.key === "Escape") { e.preventDefault(); close(); }
    });
    root.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) close(); });

    document.addEventListener("keydown", function (e) {
        const typing = e.target.closest && e.target.closest("input, textarea, [contenteditable]");
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); root.hidden ? open() : close(); }
        else if (e.key === "/" && !typing && root.hidden) { e.preventDefault(); open(); }
    });

    window.GamaPalette = { open: open, close: close };

    /* one gentle hint per session, after the loader is gone */
    try {
        if (sessionStorage.getItem("gama-tip") !== "1") {
            sessionStorage.setItem("gama-tip", "1");
            setTimeout(function () { G.toast("Tip: press Ctrl+K to jump anywhere."); }, 4500);
        }
    } catch (e) {}
}
