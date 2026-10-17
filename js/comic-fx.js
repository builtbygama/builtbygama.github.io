/* =========================================================
   COMIC FX  (2D cartoon night scene)
   Painted moon, drifting outlined clouds, hills, twinkling stars,
   flat doodles, a flying rocket, a shadow mascot, a hero character
   and click "POW!" bursts.
   ========================================================= */

function initComicFx() {

    const mount = document.getElementById("background-doodles");
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INK = "#0b0620";

    const SHAPES = {
        gear:      '<circle cx="32" cy="32" r="21" fill="none" stroke-width="9" stroke-dasharray="8 7.2"/><circle cx="32" cy="32" r="15"/><circle cx="32" cy="32" r="6" fill="' + INK + '"/>',
        container: '<rect x="6" y="16" width="52" height="32" rx="4"/><path d="M19 16v32M32 16v32M45 16v32" fill="none"/>',
        branch:    '<path d="M18 20v24M46 32c0 10-10 11-28 12" fill="none"/><circle cx="18" cy="14" r="6"/><circle cx="18" cy="50" r="6"/><circle cx="46" cy="26" r="6"/>',
        server:    '<rect x="8" y="6" width="48" height="14" rx="3"/><rect x="8" y="25" width="48" height="14" rx="3"/><rect x="8" y="44" width="48" height="14" rx="3"/><circle cx="17" cy="13" r="2.5" fill="' + INK + '"/><circle cx="17" cy="32" r="2.5" fill="' + INK + '"/><circle cx="17" cy="51" r="2.5" fill="' + INK + '"/>',
        terminal:  '<rect x="5" y="9" width="54" height="46" rx="6"/><path d="M16 26l10 8-10 8M33 43h14" fill="none"/>',
        bolt:      '<path d="M37 4 14 36h14l-6 24 28-34H36z"/>',
        sparkle:   '<path d="M32 4q3 22 28 28-25 6-28 28-3-22-28-28 25-6 28-28z"/>'
    };

    /* shape, left %, top %, size, fill, animation class, seconds, delay */
    const ITEMS = [
        ["gear",     76,  7,  64, "#ffd23f", "d-spin",    16, 0],
        ["container", 3,  6,  64, "#29b6f6", "d-bob",     10, 3],
        ["bolt",     95, 42,  46, "#ff6fb5", "d-flicker",  5, 3],
        ["branch",    8, 90,  62, "#ffd23f", "d-bob",      9, 1.5],
        ["server",   62,  6,  58, "#7c5cff", "d-bob",     11, 2.5],
        ["terminal", 34, 89,  66, "#ff6fb5", "d-bob",     10, 0.8],
        ["gear",     22, 93,  46, "#29b6f6", "d-spin",    13, 0],
        ["sparkle",  14, 22,  30, "#ffd23f", "d-twinkle",  3, 0.5],
        ["sparkle",  86, 30,  34, "#ffffff", "d-twinkle",3.5, 2],
        ["sparkle",  66, 14,  26, "#ff6fb5", "d-twinkle",  4, 1.2],
        ["sparkle",  30,  9,  28, "#29b6f6", "d-twinkle",4.5, 3],
        ["sparkle",  97, 66,  28, "#ffd23f", "d-twinkle",  3, 1],
        ["sparkle",  50, 80,  24, "#ffffff", "d-twinkle",  5, 2.5]
    ];

    let html = "";

    /* hills (bottom) */
    html += '<svg class="hills" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">' +
        '<path d="M0 40V18Q10 4 22 16T46 14T70 17T100 8V40z" fill="#2a1d80"/>' +
        '<path d="M0 40V30Q14 18 30 28T62 27T100 24V40z" fill="#1b1260"/></svg>';

    /* painted moon */
    html += '<svg class="moon" viewBox="0 0 120 120" aria-hidden="true">' +
        '<circle cx="60" cy="60" r="52" fill="#fff1b8"/>' +
        '<circle cx="42" cy="46" r="10" fill="#f3d97c"/><circle cx="76" cy="70" r="13" fill="#f3d97c"/>' +
        '<circle cx="64" cy="34" r="6" fill="#f3d97c"/><circle cx="40" cy="80" r="6" fill="#f3d97c"/></svg>';

    /* outlined clouds that drift across */
    [["8%", 190, 95, 0], ["52%", 150, 120, 40], ["76%", 230, 105, 70]].forEach(function (c) {
        html += '<svg class="cloud-drift" viewBox="0 0 64 40" style="top:' + c[0] + ";width:" + c[1] +
            "px;animation-duration:" + c[2] + "s;animation-delay:-" + c[3] + 's" aria-hidden="true">' +
            '<path d="M12 34h38a9 9 0 0 0 1-18 12 12 0 0 0-23-3 10 10 0 0 0-16 21z"/></svg>';
    });

    ITEMS.forEach(function (it) {
        const style =
            "left:" + it[1] + "%;top:" + it[2] + "%;width:" + it[3] + "px;height:" + it[3] + "px;" +
            "--z:" + Math.round(it[3] / 5) + ";--fill:" + it[4] + ";animation-duration:" + it[6] + "s;animation-delay:-" + it[7] + "s";
        html += '<svg class="cdoodle ' + it[5] + '" viewBox="0 0 64 64" style="' + style + '">' + SHAPES[it[0]] + "</svg>";
    });

    if (!reduce) {
        html += '<svg class="rocket-fly" viewBox="0 0 120 40" aria-hidden="true">' +
            '<path class="rocket-trail" d="M0 20h58"/>' +
            '<g transform="translate(58 4) rotate(90 16 16)"><path d="M16 2c6 4 8 12 6 22H10C8 14 10 6 16 2z"/><circle cx="16" cy="14" r="3" fill="#fff"/><path d="M10 24 4 32l8-2zM22 24l6 8-8-2z"/></g></svg>';
    }

    mount.insertAdjacentHTML("afterbegin", html);

    if (reduce) return;

    /* ---------- click bursts ---------- */
    const words = ["POW!", "ZAP!", "BAM!", "SHIP IT!", "DEPLOY!", "LGTM!", "BOOM!"];
    const tones = [["#ffd23f", INK], ["#ff6fb5", INK], ["#29b6f6", INK], ["#ffffff", INK]];
    let pts = "";
    for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2, r = i % 2 ? 36 : 56;
        pts += (60 + Math.cos(a) * r).toFixed(1) + "," + (60 + Math.sin(a) * r).toFixed(1) + " ";
    }

    document.addEventListener("click", function (e) {
        if (e.target.closest("input, textarea, select")) return;
        const t = tones[Math.floor(Math.random() * tones.length)];
        const el = document.createElement("div");
        el.className = "burst";
        el.style.left = e.clientX + "px";
        el.style.top = e.clientY + "px";
        el.style.setProperty("--rot", (Math.random() * 24 - 12) + "deg");
        el.innerHTML = '<svg viewBox="0 0 120 120"><polygon points="' + pts + '" fill="' + t[0] +
            '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/></svg><span style="color:' + t[1] + '">' +
            words[Math.floor(Math.random() * words.length)] + "</span>";
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 900);
        if (typeof window.mascotHop === "function") window.mascotHop();
    });
}
