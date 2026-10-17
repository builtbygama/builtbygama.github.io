/* =========================================================
   MAIN.JS
   Loads section components, starts navbar, projects, background.
   NOTE: components are loaded with fetch(), so the site must be
   served over http (VS Code Live Server, GitHub Pages, etc.).
   Double-clicking index.html (file://) will not work.
   ========================================================= */

const SECTIONS = [
    ["hero-mount",     "components/hero.html"],
    ["about-mount",    "components/about.html"],
    ["skills-mount",   "components/skills.html"],
    ["projects-mount", "components/projects.html"],
    ["workflow-mount", "components/workflow.html"],
    ["contact-mount",  "components/contact.html"],
    ["footer-mount",   "components/footer.html"]
];

async function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return false;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`${file}: ${response.status}`);
        container.innerHTML = await response.text();
        return true;
    } catch (error) {
        console.error("Component error:", file, error);
        return false;
    }
}

function showServerWarning() {
    const box = document.createElement("div");
    box.style.cssText =
        "position:relative;z-index:5;max-width:640px;margin:140px auto;" +
        "padding:24px;border:1px solid #8b5cf6;border-radius:10px;" +
        "background:#111;color:#eee;font:16px/1.6 system-ui,sans-serif";
    box.innerHTML =
        "<strong>This page must be served over http.</strong><br>" +
        "Sections are loaded with fetch(), which browsers block on file://. " +
        "Open the folder in VS Code and use Live Server, or run " +
        "<code>python -m http.server</code> in this folder.";
    document.body.prepend(box);
}

/* Missing images never show a broken-image icon */
document.addEventListener("error", function (event) {
    const img = event.target;
    if (!img || img.tagName !== "IMG") return;

    const poster = img.closest(".project-poster");
    const shot = img.closest(".project-detail-screenshot");

    if (poster) {
        poster.classList.add("project-poster-empty");
        poster.innerHTML =
            '<div class="project-poster-placeholder"><span>PROJECT</span></div>';
    } else if (shot) {
        shot.remove();
    } else if (img.id === "projectDetailImage" && img.parentElement) {
        img.parentElement.hidden = true;
    }
}, true);

document.addEventListener("DOMContentLoaded", async function () {

    if (typeof initNavbar === "function") initNavbar();
    if (typeof initShadowBackground === "function") initShadowBackground();
    if (typeof initComicFx === "function") initComicFx();

    for (const [id, file] of SECTIONS) {
        const mountEl = document.getElementById(id);
        const hasContent = mountEl && mountEl.children.length > 0;
        const ok = hasContent ? true : (location.protocol !== "file:" ? await loadComponent(id, file) : false);

        if (ok && id === "hero-mount" && typeof initHeroTerminal === "function") {
            initHeroTerminal();
        }
        if (ok && id === "projects-mount" && typeof initProjects === "function") {
            initProjects();
        }
    }

    if (typeof initStatusWindow === "function") initStatusWindow();
    if (typeof initEffects === "function") initEffects();
    if (typeof initInteract === "function") initInteract();
    if (typeof initExtras === "function") initExtras();
    if (typeof initPalette === "function") initPalette();
    if (typeof initAssistant === "function") initAssistant();
    if (typeof initPitch === "function") initPitch();

    window.dispatchEvent(new Event("portfolio:ready"));
});
