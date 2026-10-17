/* =========================================================
   NAVBAR: theme toggle + highlight the section in view
   ========================================================= */

function initNavbar() {

    const themeToggle = document.getElementById("themeToggle");
    const links = document.querySelectorAll(".dock-link[data-section]");

    /* ---------- theme ---------- */
    function applyTheme(theme) {
        document.body.classList.toggle("light", theme === "light");
        const tc = document.querySelector('meta[name="theme-color"]');
        if (tc) tc.setAttribute("content", theme === "light" ? "#d9ccff" : "#1b1253");
        try { localStorage.setItem("portfolio-theme", theme); } catch (e) {}
    }

    let saved = null;
    try { saved = localStorage.getItem("portfolio-theme"); } catch (e) {}
    applyTheme(saved === "light" ? "light" : "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            applyTheme(document.body.classList.contains("light") ? "dark" : "light");
        });
    }

    /* ---------- active section ---------- */
    function updateActive() {
        const marker = window.innerHeight * 0.4;
        let current = "home";

        links.forEach(function (link) {
            const section = document.getElementById(link.dataset.section);
            if (section && section.getBoundingClientRect().top <= marker) {
                current = link.dataset.section;
            }
        });

        links.forEach(function (link) {
            const on = link.dataset.section === current;
            link.classList.toggle("active", on);
            if (on) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
        });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();
    /* sections load after the navbar, so check again shortly */
    setTimeout(updateActive, 800);
}
