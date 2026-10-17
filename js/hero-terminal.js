/* =========================================================
   INTERACTIVE HERO TERMINAL
   Types a short intro, then visitors can type real commands.
   Try: help, skills, projects, goto contact, deploy, sudo hire-me
   ========================================================= */

function initHeroTerminal() {

    const body = document.getElementById("terminalOutput");
    const input = document.getElementById("terminalInput");
    if (!body || !input) return;

    const PROMPT = "builtbygama@cloud:~$";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

    const incident = { on: false };
    let skipIntro = false;
    let busy = false;
    const history = [];
    let hIdx = 0;

    /* ---------- output helpers ---------- */
    function line(text, cls) {
        const d = document.createElement("div");
        d.className = "terminal-line " + (cls || "terminal-output");
        d.textContent = text;
        d.style.whiteSpace = "pre-wrap";
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
        return d;
    }

    function commandLine(text) {
        const d = document.createElement("div");
        d.className = "terminal-line terminal-command";
        const p = document.createElement("span");
        p.className = "terminal-prompt";
        p.textContent = PROMPT + " ";
        const t = document.createElement("span");
        t.textContent = text || "";
        d.append(p, t);
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
        return t;
    }

    async function out(lines, cls, gap) {
        for (const l of lines) {
            line(l, cls);
            if (gap && !reduce) await sleep(gap);
        }
    }

    function go(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const SECTIONS = ["home", "about", "skills", "projects", "workflow", "contact"];

    /* ---------- commands ---------- */
    const commands = {

        help: async function () {
            await out([
                "Available commands:",
                "  whoami        who am I",
                "  why           why hire Gama",
                "  skills        my toolbox",
                "  projects      what I have built",
                "  ls            list sections",
                "  goto <name>   jump to a section",
                "  theme         switch dark / light",
                "  deploy        ship something",
                "  terraform plan | docker ps | kubectl get pods",
                "  incident      production is down. fix it",
                "  resume        open my CV",
                "  clear         clean the screen",
                "  sudo hire-me  you know you want to"
            ], "terminal-muted");
        },

        why: async function () {
            await out([
                "Why hire builtbygama:",
                "  1. Learns by building: every skill has a project behind it",
                "  2. Automation-first: manual steps become pipelines",
                "  3. Reliability mindset: plan, observe, improve",
                "  4. MMA discipline: fundamentals, repetition, calm",
                "  5. Open to cloud / DevOps roles right now"
            ], "terminal-output", 140);
            line("Next step: sudo hire-me", "terminal-success");
        },

        whoami: async function () {
            await out(["Gaddam Madhukanth, Cloud & DevOps Engineer"]);
        },

        skills: async function () {
            await out([
                "cloud      AWS, Azure",
                "iac        Terraform",
                "ci/cd      Jenkins, GitHub Actions, GitLab CI,",
                "           Azure Pipelines, CodePipeline",
                "containers Docker, Kubernetes, EKS, AKS",
                "observe    Prometheus, Grafana, CloudWatch",
                "scripting  Linux, Bash, Python"
            ]);
        },

        projects: async function () {
            if (typeof projects === "undefined") { line("no projects found", "terminal-error"); return; }
            const rows = projects.map(function (p, i) {
                const done = /complete/i.test(p.status || "");
                return String(i + 1).padStart(2, "0") + " " + (done ? "[x] " : "[ ] ") + p.title;
            });
            await out(rows, "terminal-output", 60);
            line("[x] completed   [ ] planned   (try: goto projects)", "terminal-muted");
        },

        ls: async function () {
            await out(["home/  about/  skills/  projects/  workflow/  contact/"]);
        },

        goto: async function (args) {
            const t = (args[0] || "").toLowerCase();
            if (SECTIONS.indexOf(t) === -1) { line("usage: goto <home|about|skills|projects|workflow|contact>", "terminal-error"); return; }
            line("jumping to " + t + " ...", "terminal-success");
            await sleep(350);
            go(t);
        },

        theme: async function () {
            const toggle = document.getElementById("themeToggle");
            if (toggle) toggle.click();
            line("theme switched", "terminal-success");
        },

        clear: async function () { body.innerHTML = ""; },

        deploy: async function () {
            const steps = [
                "[1/5] terraform init ........ ok",
                "[2/5] terraform plan ........ ok",
                "[3/5] docker build .......... ok",
                "[4/5] kubectl rollout ....... ok",
                "[5/5] health checks ......... ok"
            ];
            await out(steps, "terminal-output", 380);
            line("Deployment successful.", "terminal-success");
            if (window.celebrate) window.celebrate();
        },

        party: async function () {
            line("party mode on", "terminal-success");
            if (window.partyMode) window.partyMode();
        },

        terraform: async function (args) {
            if ((args[0] || "") !== "plan") { line("usage: terraform plan", "terminal-error"); return; }
            await out(["Refreshing state ... done",
                "  + aws_vpc.main", "  + aws_subnet.public[0..1]", "  + aws_eks_cluster.platform", "  + aws_iam_role.pipeline"], "terminal-output", 220);
            line("Plan: 4 to add, 0 to change, 0 to destroy.", "terminal-success");
        },

        docker: async function (args) {
            if ((args[0] || "") !== "ps") { line("usage: docker ps", "terminal-error"); return; }
            await out(["CONTAINER   IMAGE              STATUS",
                "a1b2c3d4    job-processor:1.0  Up 2 hours (healthy)",
                "e5f6a7b8    portfolio:latest   Up 5 hours (healthy)"], "terminal-output", 150);
        },

        kubectl: async function (args) {
            const a = args.join(" ");
            if (incident.on) {
                if (/^logs\b/.test(a)) {
                    await out(["api: starting ...", "api: loading cache ...", "api: OOMKilled (limit 128Mi)"], "terminal-output", 250);
                    line("Hint: raise the memory limit.", "terminal-muted"); return;
                }
                if (/^describe\b/.test(a)) {
                    await out(["State: CrashLoopBackOff", "Last State: Terminated (OOMKilled)", "Restarts: 14"], "terminal-output", 200); return;
                }
                if (/^set resources\b.*memory/.test(a)) {
                    incident.on = false;
                    await out(["deployment/api resource requirements updated", "rollout status: 3/3 pods Running"], "terminal-output", 300);
                    line("Incident resolved. That is how I debug: read logs, find the cause, fix, verify.", "terminal-success");
                    if (window.celebrate) window.celebrate(); return;
                }
            }
            if (/^get pods\b/.test(a)) {
                await out(["NAME          READY   STATUS      RESTARTS",
                    incident.on ? "api-7d9f-x2k   0/1     CrashLoopBackOff   14" : "api-7d9f-x2k   1/1     Running     0",
                    "web-5c8b-q9z   1/1     Running     0"], "terminal-output", 150);
                return;
            }
            line("usage: kubectl get pods", "terminal-error");
        },

        incident: async function () {
            incident.on = true;
            await out(["ALERT: api is down in production!",
                "Try: kubectl get pods, then kubectl logs api, kubectl describe api,",
                "then fix it with: kubectl set resources api --memory=512Mi"], "terminal-output", 200);
        },

        resume: async function () {
            line("Opening CV ...", "terminal-success");
            window.open("assets/resume.pdf", "_blank");
        },

        sudo: async function (args) {
            if ((args[0] || "") !== "hire-me") { line("sudo: permission denied", "terminal-error"); return; }
            line("[sudo] password for recruiter: ********", "terminal-muted");
            await sleep(700);
            line("Access granted. Opening contact ...", "terminal-success");
            if (window.celebrate) window.celebrate();
            await sleep(900);
            go("contact");
        }
    };

    const names = Object.keys(commands);

    async function run(raw) {
        const text = raw.trim();
        if (!text) return;
        history.push(text);
        hIdx = history.length;
        commandLine(text);

        const parts = text.split(/\s+/);
        const name = parts[0].toLowerCase();
        const alias = { whyhire: "why", best: "why", pitch: "why", hire: "why" };
        const fn = commands[name] || commands[alias[name]] || (name === "cd" ? commands.goto : null);

        busy = true;
        try {
            if (fn) await fn(parts.slice(1));
            else line("command not found: " + name + "  (type help)", "terminal-error");
        } finally {
            busy = false;
            body.scrollTop = body.scrollHeight;
        }
    }

    /* ---------- keyboard ---------- */
    input.addEventListener("keydown", function (e) {
        skipIntro = true;

        if (e.key === "Enter") {
            if (busy) return;
            const v = input.value;
            input.value = "";
            run(v);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (hIdx > 0) input.value = history[--hIdx];
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            hIdx = Math.min(history.length, hIdx + 1);
            input.value = history[hIdx] || "";
        } else if (e.key === "Tab") {
            e.preventDefault();
            const v = input.value.toLowerCase();
            const m = names.filter(function (n) { return v && n.indexOf(v) === 0; });
            if (m.length === 1) input.value = m[0] + (m[0] === "goto" || m[0] === "sudo" ? " " : "");
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            body.innerHTML = "";
        }
    });

    const win = input.closest(".terminal-window");
    if (win) win.addEventListener("click", function () { skipIntro = true; input.focus({ preventScroll: true }); });

    /* ---------- intro ---------- */
    async function intro() {
        if (body.children.length > 0) {
            return;
        }

        const script = [
            ["whoami", ["Gaddam Madhukanth, Cloud & DevOps Engineer"]],
            ["cat stack.txt", ["AWS  Azure  Terraform  Docker", "Kubernetes  Jenkins  GitHub Actions"]],
            ["terraform apply", ["Apply complete!"]]
        ];

        for (const step of script) {
            if (skipIntro) break;
            const target = commandLine("");
            if (reduce) { target.textContent = step[0]; }
            else {
                for (const ch of step[0]) {
                    if (skipIntro) { target.textContent = step[0]; break; }
                    target.textContent += ch;
                    await sleep(55);
                }
            }
            if (skipIntro) break;
            await sleep(reduce ? 0 : 300);
            step[1].forEach(function (l) { line(l, l === "Apply complete!" ? "terminal-success" : "terminal-output"); });
            await sleep(reduce ? 0 : 600);
        }
        line("Type 'help' to explore. Try 'sudo hire-me'.", "terminal-muted");
    }

    intro();
}
