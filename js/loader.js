/* =========================================================
   LOADER
   A short "boot" screen: init > build > test > deploy.
   - First visit in a session: ~1.7s. Repeat loads: ~0.4s.
   - Waits for the real page (portfolio:ready) and web fonts.
   - Skip with the button, Esc, Enter or Space.
   - Never blocks forever: hard stop after 7s.
   ========================================================= */

(function () {

    const root = document.documentElement;
    const el = document.getElementById("loader");
    if (!el) return;

    const bar = document.getElementById("loaderBar");
    const text = document.getElementById("loaderText");
    const skip = document.getElementById("loaderSkip");
    const steps = el.querySelectorAll(".loader-steps li");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seen = false;
    try { seen = sessionStorage.getItem("gama-loaded") === "1"; } catch (e) {}

    const MIN = reduce ? 300 : (seen ? 450 : 1700);
    const MESSAGES = [
        [0, "Initializing environment..."],
        [28, "Building components..."],
        [56, "Running checks..."],
        [82, "Deploying portfolio..."],
        [100, "Ready."]
    ];

    root.classList.add("is-loading");

    const start = performance.now();
    let ready = false, fonts = false, skipped = false, finished = false, shown = 0;

    window.addEventListener("portfolio:ready", function () { ready = true; });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { fonts = true; });
        /* never hold the page for fonts: short cap (fonts are cached on repeat visits) */
        setTimeout(function () { fonts = true; }, reduce ? 200 : (seen ? 250 : 1200));
    } else { fonts = true; }

    setTimeout(function () { skip.classList.add("show"); }, 900);

    function paint(p) {
        shown = p;
        bar.style.width = p + "%";
        let msg = MESSAGES[0][1];
        MESSAGES.forEach(function (m) { if (p >= m[0]) msg = m[1]; });
        text.textContent = msg;
        steps.forEach(function (li) { li.classList.toggle("done", p >= +li.dataset.at); });
    }

    function finish() {
        if (finished) return;
        finished = true;
        paint(100);
        try { sessionStorage.setItem("gama-loaded", "1"); } catch (e) {}
        setTimeout(function () {
            el.classList.add("out");
            root.classList.remove("is-loading");
            setTimeout(function () {
                el.remove();
                const style = document.getElementById("loader-css");
                if (style) style.remove();
                window.dispatchEvent(new Event("loader:done"));
            }, reduce ? 350 : 800);
        }, reduce ? 0 : 280);
    }

    function tick(now) {
        if (finished) return;
        const elapsed = now - start;
        const timeGoal = Math.min(90, (elapsed / MIN) * 90);

        if (elapsed > 7000) { finish(); return; }

        if (ready && fonts && (elapsed >= MIN || skipped)) { finish(); return; }

        paint(Math.max(shown, Math.round(skipped ? Math.max(timeGoal, 90) : timeGoal)));
        requestAnimationFrame(tick);
    }

    function doSkip() { skipped = true; }
    skip.addEventListener("click", doSkip);
    document.addEventListener("keydown", function (e) {
        if (!finished && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); doSkip(); }
    });

    requestAnimationFrame(tick);
})();
