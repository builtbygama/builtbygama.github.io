/* =========================================================
   GAMA BOT: a friendly, scripted portfolio assistant (text only)
   - Welcomes visitors, checks in, asks what brings them here
     and tailors its suggestions.
   - Jokes, fun facts, a 3-question DevOps quiz, an intro-email drafter.
   - Answers questions from what is actually on this page
     (projects.js, skills cards, workflow, contact links).
   - Honest by design: it says it is scripted, and never invents
     facts about Gama. Unknown questions get "I only know what is on
     this site" plus suggestions.
   - Never opens by itself. The visitor's first name (optional) lives in
     sessionStorage only; nothing is sent anywhere.
   ========================================================= */

function initAssistant() {

    const G = window.Gama;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- DOM ---------- */
    function ghost() {
        return '<svg viewBox="0 0 100 100" aria-hidden="true"><path class="g-body" d="M14 80C4 52 18 22 48 18c30-3 44 20 38 48-2 8 4 14-6 14-8 0-8-8-16-8s-8 8-16 8-8-8-16-8-8 8-14 8z"/>' +
            '<g class="g-eyes"><ellipse cx="36" cy="46" rx="8" ry="10" fill="#fff"/><ellipse cx="62" cy="46" rx="8" ry="10" fill="#fff"/>' +
            '<circle class="g-pupil" cx="36" cy="48" r="4.2" fill="#0b0620"/><circle class="g-pupil" cx="62" cy="48" r="4.2" fill="#0b0620"/></g>' +
            '<path d="M42 64q7 6 14 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
    }

    const wrap = document.createElement("div");
    wrap.className = "asst";
    wrap.innerHTML =
        '<div class="asst-panel" id="asstPanel" role="dialog" aria-label="Portfolio assistant" hidden>' +
            '<header class="asst-head">' +
                '<div class="asst-avatar" aria-hidden="true">' + ghost() + '</div>' +
                '<div class="asst-title"><strong>builtbygama Bot</strong><span><i class="asst-live" aria-hidden="true"></i>Cloud guide & cynic</span></div>' +
                '<button type="button" class="asst-restart" aria-label="Start the conversation over" title="Start over">&#8635;</button>' +
                '<button type="button" class="asst-close" aria-label="Close assistant">&times;</button>' +
            '</header>' +
            '<div class="asst-log" id="asstLog" role="log" aria-live="polite"></div>' +
            '<div class="asst-chips" id="asstChips"></div>' +
            '<form class="asst-form" id="asstForm" autocomplete="off">' +
                '<input id="asstInput" type="text" maxlength="140" placeholder="Type a message..." aria-label="Type a message">' +
                '<button type="submit" aria-label="Send">&#10148;</button>' +
            '</form>' +
        '</div>' +
        '<button type="button" class="asst-launcher" id="asstLauncher" aria-label="Open assistant" aria-expanded="false" aria-controls="asstPanel">' +
            ghost() + '<i class="asst-dot" aria-hidden="true"></i>' +
        '</button>';
    document.body.appendChild(wrap);

    const panel = wrap.querySelector("#asstPanel");
    const launcher = wrap.querySelector("#asstLauncher");
    const log = wrap.querySelector("#asstLog");
    const chipsBox = wrap.querySelector("#asstChips");
    const form = wrap.querySelector("#asstForm");
    const input = wrap.querySelector("#asstInput");
    const dot = wrap.querySelector(".asst-dot");

    /* ---------- state ---------- */
    let isOpen = false, started = false, tourToken = 0, epoch = 0, pending = null, chain = Promise.resolve();
    let jokeOrder = [], jokeAt = 0, factAt = 0, quiz = null;

    const visitor = { name: "", role: "", mood: "" };
    try { Object.assign(visitor, JSON.parse(sessionStorage.getItem("gama-visitor") || "{}")); } catch (e) {}
    function saveVisitor() { try { sessionStorage.setItem("gama-visitor", JSON.stringify(visitor)); } catch (e) {} }
    let returning = false;
    try { returning = localStorage.getItem("gama-visited") === "1"; } catch (e) {}
    const nm = function () { return visitor.name ? ", " + visitor.name : ""; };

    const sleep = function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? Math.min(ms, 40) : ms); }); };
    function scroll() { log.scrollTop = log.scrollHeight; }

    /* ---------- rendering ---------- */
    function userSay(text) {
        const d = document.createElement("div");
        d.className = "msg user";
        d.textContent = text;
        log.appendChild(d); scroll();
    }

    async function botSay(text, actions) {
        const mine = epoch;
        const typing = document.createElement("div");
        typing.className = "msg bot typing";
        typing.innerHTML = "<i></i><i></i><i></i>";
        log.appendChild(typing); scroll();
        await sleep(420);
        typing.remove();
        if (mine !== epoch) return false;

        const d = document.createElement("div");
        d.className = "msg bot";
        log.appendChild(d);

        const lines = String(text).split("\n");
        if (reduce) { d.style.whiteSpace = "pre-line"; d.textContent = text; }
        else {
            for (let li = 0; li < lines.length; li++) {
                const row = document.createElement("div");
                d.appendChild(row);
                const words = lines[li].split(" ");
                for (let w = 0; w < words.length; w++) {
                    row.textContent += (w ? " " : "") + words[w];
                    scroll();
                    await sleep(24);
                    if (mine !== epoch) return false;
                }
            }
        }

        if (actions && actions.length) {
            const box = document.createElement("div");
            box.className = "msg-actions";
            actions.forEach(function (a) {
                const b = document.createElement("button");
                b.type = "button"; b.textContent = a.label;
                b.addEventListener("click", function () { a.run(); });
                box.appendChild(b);
            });
            d.appendChild(box);
        }
        scroll();
        return true;
    }

    /* chips: "text" or { label, ask } */
    function setChips(list) {
        chipsBox.innerHTML = "";
        list.slice(0, 5).forEach(function (c) {
            const label = typeof c === "string" ? c : c.label;
            const send = typeof c === "string" ? c : c.ask;
            const b = document.createElement("button");
            b.type = "button"; b.textContent = label;
            b.addEventListener("click", function () { ask(send); });
            chipsBox.appendChild(b);
        });
    }

    function enqueue(fn) {
        const e = epoch;
        chain = chain.then(function () { return e === epoch ? fn() : null; }).catch(function () {});
        return chain;
    }

    /* ---------- facts read live from the page ---------- */
    const P = function () { return G.getProjects(); };
    const doneList = function () { return P().filter(G.isDone); };

    function skillGroups() {
        return G.$$(".skill-card").map(function (card) {
            const t = (G.$(".skill-card-title", card) || card.querySelector("h3,h4") || {}).textContent;
            return { title: (t || "").replace(/\s+/g, " ").trim(), tools: G.$$(".skill-icon-item", card).map(function (c) { return G.chipName(c); }) };
        }).filter(function (g) { return g.title && g.tools.length; });
    }

    function workflowSteps() {
        return G.$$(".workflow-step").map(function (s) {
            const l = G.$(".workflow-label", s), h = s.querySelector("h3,h4");
            return (l ? l.textContent.trim() : "") + (h ? ": " + h.textContent.replace(/\s+/g, " ").trim() : "");
        });
    }

    function usage() {
        const u = {};
        doneList().forEach(function (p) {
            const seen = {};
            (p.technologies || []).forEach(function (t) { if (!seen[t]) { u[t] = (u[t] || 0) + 1; seen[t] = 1; } });
        });
        return u;
    }

    function currentSection() {
        const ids = ["home", "about", "skills", "projects", "workflow", "contact"];
        const mid = window.innerHeight * 0.4;
        let cur = "home";
        ids.forEach(function (id) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= mid) cur = id;
        });
        return cur;
    }

    function contextChips() {
        const map = {
            home:     ["Tell me a sarcastic joke", "Roast Kubernetes", "Why hire Madhu?", "Take a quick tour", "Contact"],
            about:    ["Tell me a sarcastic joke", "Why hire Madhu?", "What about MMA?", "Tools used most", "Contact"],
            skills:   ["Roast Kubernetes", "Tools used most", "Do you know Docker?", "Quick DevOps quiz", "Tell me a sarcastic joke"],
            projects: ["Show projects", "Which project fits my team?", "Tell me a sarcastic joke", "Why hire Madhu?", "Contact"],
            workflow: ["Roast Friday deploys", "How does he work?", "Quick DevOps quiz", "Tell me a sarcastic joke", "Contact"],
            contact:  ["Draft an intro email", "Download CV", "Tell me a sarcastic joke", "Why hire Madhu?", "Show projects"]
        };
        return map[currentSection()] || map.home;
    }

    /* say + set chips in one go */
    async function reply(text, opts) {
        opts = opts || {};
        const ok = await botSay(text, opts.actions);
        if (ok !== false) setChips(opts.chips || contextChips());
        return ok;
    }

    /* ---------- content ---------- */
    const JOKES = [
        ["Why do SREs cry in the shower?", "Because Kubernetes has 47 ways to fail, and YAML indentation is 40 of them."],
        ["Terraform plan: 1 to add, 0 to change, 1 to destroy.", "Please stare at that last number and hold your breath for 30 seconds."],
        ["A recruiter asks: 'Do you have 10 years of Kubernetes experience?'", "Kubernetes is barely 10 years old. Time travel isn't in Madhu's stack... yet."],
        ["'It works on my machine!'", "Congratulations! We'll wrap your laptop in bubble wrap and ship it straight to production."],
        ["What's the difference between a DevOps engineer and a magician?", "The magician actually knows how things disappeared."],
        ["Why did the container go to therapy?", "Too many unresolved dependencies and constant abandonment issues from Kubernetes pod eviction."],
        ["Never deploy on a Friday afternoon.", "Unless you consider weekend incident response with cold pizza an adrenaline sport."],
        ["Microservices architecture in a nutshell:", "Taking a single clean monolith that worked, and turning it into 38 tiny services so everyone can have a shared panic attack over latency."],
        ["Why did the cloud architect go bankrupt?", "They left an idle NAT Gateway and a forgotten test EKS cluster running over a long weekend."],
        ["Documentation is like deodorant.", "The people who scream that it's essential are usually the ones who never use it."],
        ["I'd tell you a joke about UDP...", "but you probably wouldn't get it and I wouldn't care."],
        ["How do you know an engineer writes Terraform?", "Don't worry, they'll complain about state locks within the first 2 minutes of meeting you."],
        ["Why did the server stay calm during the outage?", "Because it was already dead inside. Uptime: 0.00%."],
        ["There are two types of engineers:", "Those who have accidentally dropped a production table, and those who are lying."]
    ];

    const FACTS = [
        "Kubernetes comes from the Greek word for helmsman, the person who steers a ship.",
        "Docker's mascot is a whale named Moby Dock.",
        "Terraform's configuration language is called HCL, short for HashiCorp Configuration Language.",
        "A moth found in a Harvard Mark II relay in 1947 became the famous \"first actual bug\".",
        "Prometheus collects the metrics and Grafana draws the dashboards: a classic pairing, and both are in Gama's toolbox.",
        "Gama trains MMA and says the same discipline applies to engineering: repetition and fundamentals."
    ];

    const QUIZ = [
        { q: "What does IaC stand for?", opts: ["Infrastructure as Code", "Integrated Automated Cloud", "Internal App Container"], a: 0, why: "Infrastructure as Code means defining servers and networks in files you can version and review." },
        { q: "Which tool provisions infrastructure from declarative configuration?", opts: ["Grafana", "Terraform", "Prometheus"], a: 1, why: "Terraform describes the desired state and works out the changes." },
        { q: "In Kubernetes, the smallest deployable unit is a...?", opts: ["Pod", "Cluster", "Namespace"], a: 0, why: "A Pod wraps one or more containers that run together." }
    ];

    const FAQ = [
        ["Why hire Gama?", "why hire best candidate strengths convince pitch"],
        ["Take a quick tour", "tour guide walk show around"],
        ["What are Gama's skills?", "skills tools stack technologies toolbox"],
        ["Show projects", "projects built work portfolio examples"],
        ["How can I contact him?", "contact email reach connect linkedin github"],
        ["Tell me a joke", "joke funny laugh humour"],
        ["How does Gama work?", "workflow process approach method"],
        ["Do you know Terraform?", "terraform docker kubernetes aws azure jenkins tool know"],
        ["Tell me a fun fact", "fact trivia interesting"],
        ["Quick DevOps quiz", "quiz game challenge test"],
        ["Download CV", "cv resume curriculum"],
        ["Tools used most", "most used top popular tools"],
        ["Draft an intro email", "email draft message write intro"]
    ];

    /* ---------- flows ---------- */
    async function welcome() {
        const h = new Date().getHours();
        const hello = h < 5 ? "Burning the midnight oil or did an on-call alert wake you up?" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Evening check-in";
        await botSay((returning ? "Back for round two? I respect the dedication" : hello) + nm() + "! Welcome to Madhu's portfolio.");
        await botSay("I'm builtbygama Bot � part cloud tour guide, part full-time cynic about AWS bills and YAML spacing. Ask me anything, or let me roast a tool for you.");

        if (visitor.role) {
            await reply("What would you like to explore today?", { chips: ["Why hire Madhu?", "Tell me a sarcastic joke", "Roast Kubernetes", "Show projects", "Contact"] });
            return;
        }
        if (await botSay("First things first: How's your day going?")) {
            pending = { handle: moodReply };
            setChips(["Great", "Pretty busy", "Surviving", "Skip the small talk"]);
        }
    }

    async function moodReply(text) {
        const s = text.toLowerCase().trim();
        if (/^skip/.test(s)) { pending = null; await botSay("Direct and to the point. I respect that � like passing '--force' on a command you probably shouldn't."); await askPurpose(); return true; }
        const m = /^(i'?m |i am |feeling |pretty |really |so |all |doing |kinda )*(great|good|fine|awesome|amazing|happy|well|fantastic|excellent|busy|hectic|swamped|okay|ok|meh|so-?so|surviving|tired|bad|rough|stressed|sad|down)\b/.exec(s);
        if (!m) return false;
        const w = m[2];
        let r;
        if (/great|good|fine|awesome|amazing|happy|well|fantastic|excellent/.test(w)) {
            visitor.mood = "good";
            r = "Suspicious. No production alerts on Slack? Did somebody turn off monitoring or are you living dangerously? Either way, love that energy.";
        } else if (/busy|hectic|swamped/.test(w)) {
            visitor.mood = "busy";
            r = "Let me guess: 5 Zoom meetings that could've been a single bash script, and 3 Jira tickets nobody wants to touch? I'll keep this short and punchy.";
        } else {
            visitor.mood = "low";
            r = "Surviving on caffeine and hoping nobody pushes to 'main' on a Friday? Totally valid. Let me know if you need a sarcastic joke to cheer up.";
        }
        pending = null; saveVisitor();
        await botSay(r);
        await askName();
        return true;
    }

    async function askName() {
        if (visitor.name) { await askPurpose(); return; }
        if (await botSay("By the way, what should I call you? (Only for this visit. I don't send it anywhere.)")) {
            pending = { handle: nameReply };
            setChips(["Skip"]);
        }
    }

    const NOT_A_NAME = /^(skills?|projects?|contact|joke|help|tour|why|hire|hiring|cv|resume|quiz|stop|hi|hello|hey|thanks|bye|yes|no|ok|okay)$/i;
    async function nameReply(text) {
        const s = text.trim();
        if (/^(skip|no|nope|nah|rather not|pass)$/i.test(s)) { pending = null; await botSay("No worries, I'll call you friend."); await askPurpose(); return true; }
        if (s.indexOf("?") !== -1 || s.split(/\s+/).length > 4 || /^(what|how|who|why|do|can|are|is|tell|show|take)\b/i.test(s)) return false;
        const m = /^(?:i'?m|i am|my name is|call me|it'?s|this is)?\s*([A-Za-z][A-Za-z.'-]{1,20})(?:\s+[A-Za-z.'-]+)?$/i.exec(s);
        if (!m || NOT_A_NAME.test(m[1])) return false;
        visitor.name = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
        pending = null; saveVisitor();
        await botSay("Nice to meet you, " + visitor.name + "!");
        await askPurpose();
        return true;
    }

    async function askPurpose() {
        if (await botSay("What brings you here today?")) {
            pending = { handle: purposeReply };
            setChips(["I'm hiring", "I'm a recruiter", "Fellow engineer", "Just exploring"]);
        }
    }

    async function purposeReply(text) {
        const s = text.toLowerCase().trim();
        let role = null;
        if (/^(i'?m |i am |we'?re |we are )?(hiring|a hiring manager|looking to hire)/.test(s)) role = "hiring";
        else if (/^(i'?m |i am )?(a |in )?(recruiter|recruiting|hr|talent)/.test(s)) role = "recruiter";
        else if (/^(i'?m |i am )?(a |an )?(fellow )?(engineer|developer|devops|sre|student)/.test(s)) role = "engineer";
        else if (/^(just )?(exploring|browsing|looking|curious)/.test(s)) role = "explorer";
        if (!role) return false;

        pending = null; visitor.role = role; saveVisitor();
        const n = nm().replace(", ", "");

        if (role === "hiring") {
            await botSay("Bingo" + nm() + "! Great timing. Madhu is open to cloud / DevOps roles right now. He actually writes infrastructure as code instead of posting 'hustle' quotes on LinkedIn.", [
                { label: "Why hire Madhu?", run: function () { ask("Why hire Madhu?"); } }, { label: "See the projects", run: function () { G.go("projects"); } }]);
            if (await botSay("What kind of stack or role are you hiring for?")) {
                pending = { handle: roleReply };
                setChips(["Cloud engineer", "DevOps / platform", "SRE", "Something else"]);
            }
        } else if (role === "recruiter") {
            await reply("Welcome" + nm() + "! To save you scanning buzzwords: Madhu has " + doneList().length + " real completed projects, works with AWS/Terraform/Docker/Kubernetes, and his CV is one click away. No 15-minute phone screens required just to see his resume!",
                { actions: [{ label: "Download CV", run: G.openResume }], chips: ["Why hire Madhu?", "Download CV", "Draft an intro email", "Tell me a sarcastic joke", "Tools used most"] });
        } else if (role === "engineer") {
            await reply("A fellow keyboard warrior" + nm() + "! We can skip the corporate fluff: check out his Terraform configs, roast his Kubernetes setups, or ask me which tools show up the most in his pipelines.",
                { chips: ["Tools used most", "Show projects", "Roast Kubernetes", "Quick DevOps quiz", "Tell me a sarcastic joke"] });
        } else {
            await reply("Window shopping" + nm() + "? Totally fair. Want a 30-second portfolio tour, or shall I crack a sarcastic DevOps joke first?",
                { chips: ["Tell me a sarcastic joke", "Roast Kubernetes", "Take a quick tour", "Why hire Madhu?", "Quick DevOps quiz"] });
        }
        return true;
    }

    async function roleReply(text) {
        const s = text.toLowerCase().trim();
        const m = /^(cloud|devops|platform|sre|something else|other)/.exec(s);
        if (!m) return false;
        pending = null;
        const groups = skillGroups();
        const find = function (re) { return groups.filter(function (g) { return re.test(g.title.toLowerCase()); }); };
        let pick = [], line;
        if (m[1] === "cloud") { pick = find(/cloud|infrastructure/); line = "For cloud work, the relevant toolbox is"; }
        else if (m[1] === "devops" || m[1] === "platform") { pick = find(/ci\/cd|container/); line = "For DevOps / platform work, the relevant toolbox is"; }
        else if (m[1] === "sre") { pick = find(/observab|scripting/); line = "For reliability work, the relevant toolbox is"; }
        const tools = [].concat.apply([], pick.map(function (g) { return g.tools; }));
        const text2 = tools.length ? line + ": " + tools.slice(0, 10).join(", ") + "." : "Gama's full toolbox is on the Skills section.";
        await reply(text2 + " Want to see the projects that use them?",
            { actions: [{ label: "See projects", run: function () { G.go("projects"); } }], chips: ["Which project fits my team?", "Draft an intro email", "Why hire Gama?", "Download CV", "Tell me a joke"] });
        return true;
    }

    const ROASTS = {
        k8s: "Kubernetes: Because why simply run a Docker container on an EC2 instance when you can deploy an etcd cluster, 3 worker nodes, ingress controllers, service meshes, helm charts, and 400 lines of YAML just to serve a static 'Hello World' page?",
        friday: "Deploying on a Friday afternoon is the purest adrenaline sport known to engineering. One 'git push origin main' at 4:55 PM, and suddenly your weekend plans are 14 hours of reading CloudWatch logs with lukewarm coffee.",
        aws: "AWS pricing was designed by mathematicians who wanted to see if humans could be billed for breathing near an S3 bucket. Did you know NAT Gateways charge you hourly just for the privilege of existing? True story.",
        microservices: "Microservices: Taking one simple monolith that worked, and turning it into 42 separate services communicating over gRPC so everyone can have a shared panic attack when latency hits 4 seconds.",
        ai: "Everyone wants an 'AI-powered pipeline' until they realize it is just an if-else statement wrapped in an expensive API call that hallucinates fake kubectl commands.",
        general: "DevOps reality: 10% writing code, 20% waiting for CI/CD builds, and 70% wondering which invisible space in your YAML file took down production."
    };

    async function tellRoast(topic) {
        topic = (topic || "").toLowerCase();
        let r = ROASTS.general;
        if (/k8s|kubernetes|pod|cluster/.test(topic)) r = ROASTS.k8s;
        else if (/friday|weekend|deploy/.test(topic)) r = ROASTS.friday;
        else if (/aws|bill|pricing|cloud/.test(topic)) r = ROASTS.aws;
        else if (/microservice|service/.test(topic)) r = ROASTS.microservices;
        else if (/ai|llm|gpt/.test(topic)) r = ROASTS.ai;

        const kickers = [
            "Buckle up, here is some unfiltered cloud truth:",
            "Oh, you want a roast? Here it comes:",
            "Brutally honest DevOps moment:"
        ];
        const intro = kickers[Math.floor(Math.random() * kickers.length)];

        await botSay(intro);
        await sleep(600);
        return reply(r, { chips: ["Another roast", "Tell me a sarcastic joke", "Why hire Madhu?", "Quick DevOps quiz", "Show projects"] });
    }

    async function tellJoke() {
        if (jokeAt >= jokeOrder.length) {
            jokeOrder = JOKES.map(function (_, i) { return i; }).sort(function () { return Math.random() - 0.5; });
            jokeAt = 0;
        }
        const j = JOKES[jokeOrder[jokeAt++]];
        const e = epoch;
        const kickers = [
            "Here is one that hurts because it is true:",
            "A little cloud trauma for your soul:",
            "Ready for some unfiltered dev sarcasm?",
            "Hot off the CI/CD pipeline:"
        ];
        const kicker = kickers[Math.floor(Math.random() * kickers.length)];
        if (!(await botSay(kicker + "\n\n" + j[0]))) return;
        await sleep(1000);
        if (e !== epoch) return;
        await reply(j[1], { chips: ["Another sarcastic joke", "Roast Kubernetes", "Roast Friday deploys", "Why hire Madhu?", "Quick DevOps quiz"] });
    }

    async function tellFact() {
        const f = FACTS[factAt++ % FACTS.length];
        await reply("Fun fact: " + f, { chips: ["Another fun fact", "Tell me a joke", "Quick DevOps quiz", "Show projects", "Why hire Gama?"] });
    }

    /* quiz */
    async function startQuiz() {
        quiz = { i: 0, score: 0 };
        await botSay("Quick DevOps quiz: 3 questions, no pressure, no leaderboard.");
        await quizAsk();
    }

    async function quizAsk() {
        const q = QUIZ[quiz.i];
        if (await botSay("Q" + (quiz.i + 1) + ". " + q.q)) {
            pending = { handle: quizReply };
            setChips(q.opts);
        }
    }

    async function quizReply(text) {
        if (!quiz) return false;
        const q = QUIZ[quiz.i];
        const s = text.toLowerCase().trim();
        let pickIdx = -1;
        q.opts.forEach(function (o, i) { if (o.toLowerCase() === s || s === "abc"[i]) pickIdx = i; });
        if (pickIdx < 0) return false;

        pending = null;
        const right = pickIdx === q.a;
        if (right) quiz.score++;
        await botSay((right ? "Correct! " : "Not quite. The answer is " + q.opts[q.a] + ". ") + q.why);
        quiz.i++;
        if (quiz.i < QUIZ.length) { await quizAsk(); return true; }

        const sc = quiz.score; quiz = null;
        const verdict = sc === 3 ? "Flawless. You'd fit right in on a DevOps team." : sc === 2 ? "Solid. Two out of three is a good deploy." : "No stress. That's what projects are for.";
        await reply(sc + "/3. " + verdict + " Gama puts these ideas to work in real projects.",
            { actions: [{ label: "See the projects", run: function () { G.go("projects"); } }], chips: ["Show projects", "Why hire Gama?", "Tell me a joke", "Draft an intro email", "Download CV"] });
        return true;
    }

    /* intro email drafter */
    async function draftEmail() {
        const c = G.contact();
        const who = visitor.name || "(your name)";
        const why = { hiring: "I'm hiring for a cloud / DevOps role and your projects caught my eye", recruiter: "I'm recruiting for cloud / DevOps roles and think you could be a great fit", engineer: "As a fellow engineer, I enjoyed your projects" }[visitor.role] || "I enjoyed browsing your projects";
        const subject = "Hello from " + (visitor.name || "a visitor") + " (via your portfolio)";
        const body = "Hi Gama,\n\nI came across your portfolio. " + why + ". I'd love to have a quick chat.\n\nBest,\n" + who;
        const acts = [{ label: "Copy draft", run: function () { G.copy("Subject: " + subject + "\n\n" + body, "Draft"); } }];
        if (c.email) acts.unshift({ label: "Open in email app", run: function () { location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body); } });
        await reply("Here's a quick draft. Edit it however you like:\n\nSubject: " + subject + "\n\n" + body + (c.email ? "" : "\n\n(Gama's email isn't published on this page yet, so copy the draft and use the contact section.)"),
            { actions: acts, chips: ["Download CV", "Why hire Gama?", "Show projects", "Tell me a joke", "Contact"] });
    }

    /* project helpers */
    function shorten(t, n) { return t.length > n ? t.slice(0, n - 1) + "…" : t; }

    async function projectPicker(lead) {
        const d = doneList().slice(0, 4);
        if (await botSay(lead || "Which one sounds closest to what your team does?")) {
            setChips(d.map(function (p) { return { label: shorten(p.title, 26), ask: p.title }; }).concat(["Why hire Gama?"]));
        }
    }

    function describeProject(p) {
        const desc = (p.description || "").replace(/\s+/g, " ").trim();
        const tech = (p.technologies || []).slice(0, 8).join(", ");
        const acts = [{ label: "Open in Projects", run: function () { G.flashProject(p.title); } }];
        if (p.github && /^https?:/.test(p.github)) acts.push({ label: "Open repo", run: function () { window.open(p.github, "_blank", "noopener"); } });
        return { text: p.title + " (" + (G.isDone(p) ? "completed" : "planned") + ")\n" + (desc ? desc + "\n" : "") + (tech ? "Tools: " + tech : ""), actions: acts };
    }

    /* ---------- routing ---------- */
    async function route(text) {
        if (pending) {
            const p = pending;
            const handled = await p.handle(text);
            if (handled) return;
            if (pending === p) pending = null;
        }

        const t = text.toLowerCase().trim();
        const has = function (re) { return re.test(t); };
        const D = doneList(), planned = P().length - D.length;
        const c = G.contact();

        /* greetings and manners */
        if (has(/^(hi|hello|hey|yo|hola|namaste|sup|good (morning|evening|afternoon))\b/)) {
            return reply("Hi" + nm() + "! Great to see you. What can I show you?");
        }
        if (has(/\b(thanks|thank you|thx|cheers|appreciate)\b/)) return reply("You're welcome" + nm() + "! Anything else I can help with?");
        if (has(/\b(bye|goodbye|see you|gotta go|leaving)\b/)) {
            return reply("Thanks for stopping by" + nm() + ". Before you go: one message to Gama could start something good.",
                { actions: [{ label: "Say hello", run: function () { G.go("contact"); } }, { label: "Download CV", run: G.openResume }], chips: ["Why hire Gama?", "Draft an intro email", "Show projects"] });
        }
        if (has(/\b(love you|you'?re (great|awesome|funny|cool|amazing)|good bot|nice bot)\b/)) return reply("Aww, thank you. I'll pass it on to Gama. (He doesn't know I'm biased yet.)");

        /* small talk */
        if (has(/\b(how are you|how'?s it going|how are things|you good|what'?s up|wassup)\b/)) {
            if (await botSay("Running at 100% uptime with zero incidents, thanks for asking! How about you?")) {
                pending = { handle: moodReply };
                setChips(["Great", "Pretty busy", "Just okay", "Skip the small talk"]);
            }
            return;
        }
        if (has(/^(i'?m |i am |feeling |doing )(great|good|fine|well|awesome|okay|ok|tired|busy|stressed|sad|bad)/)) {
            const low = /tired|stressed|sad|bad/.test(t);
            return reply(low ? "Sorry to hear that. Want a joke to lighten things up?" : "Glad to hear it! Let's make it even better.", { chips: low ? ["Tell me a joke", "Take a quick tour", "Why hire Gama?"] : undefined });
        }
        if (has(/\b(who are you|your name|what are you)\b/)) return reply("I'm Gama Bot, the assistant that lives on this page. I answer from what's here: projects, skills, workflow and contact info.");
        if (has(/\b(are you|r u) (an? )?(ai|bot|human|real|robot|chatgpt|gpt|person)\b/)) {
            return reply("AI? Please! I don't consume a nuclear power plant's worth of water or hallucinate fake npm packages. I'm 100% handcrafted JavaScript, seasoned with genuine cloud sarcasm. Everything I say comes from Madhu's actual portfolio.");
        }
        if (has(/\b(roast|k8s roast|roast k8s|roast kubernetes|roast friday|roast aws)\b/)) {
            return tellRoast(t);
        }
        if (has(/\b(joke|funny|laugh|humou?r|make me smile|another one|sarcastic joke)\b/)) return tellJoke();
        if (has(/^another joke|one more joke|tell another/)) return tellJoke();
        if (has(/\b(fun fact|another fun fact|trivia fact|tell me something|something interesting)\b/)) return tellFact();
        if (has(/\b(quiz|trivia|game|challenge|test me)\b/)) return startQuiz();
        if (has(/\b(favou?rite)\b/)) return reply("Favourite tool? Terraform: plan before you apply is a life philosophy. Favourite colours: violet and gold, obviously.");
        if (has(/\b(secret|easter egg|hidden|cheat)\b/)) return reply("A few hints: click the hero terminal and try why, deploy or party. Press Ctrl+K for the command palette. And the Konami code does something fun.");
        if (has(/\bsudo hire.?me\b/)) {
            if (window.celebrate) window.celebrate();
            return reply("[sudo] password accepted. Access granted. Opening contact...", { actions: [{ label: "Go to Contact", run: function () { G.go("contact"); } }] }).then(function () { G.go("contact"); });
        }
        if (has(/\b(hush|quiet|mute|stop (the )?(tips|bubbles)|be quiet|shut up)\b/)) {
            if (window.GamaPitch && window.GamaPitch.mute) window.GamaPitch.mute();
            return reply("Done. No more speech bubbles. I'm still here whenever you want to chat.");
        }
        if (has(/\b(start over|restart|reset)\b/)) { reset(); return; }
        if (has(/\b(weather)\b/)) return reply("I can't see the weather, but it's always sunny in the pipeline.");

        /* honest "not on this page" answers */
        if (has(/\b(salary|rate|ctc|compensation|expected pay|pay)\b/)) return reply("Whoa there, moneybags! I'm just a bundle of JavaScript living rent-free in your browser � I don't negotiate paychecks. Drop Madhu an email: he's approachable, reasonable, and worth every dollar.", { actions: [{ label: "Say hello", run: function () { G.go("contact"); } }] });
        if (has(/\b(location|based|relocat|remote|where (are|is|do))\b/)) return reply("This page doesn't say where Gama is based or his remote preferences, so I won't guess. Best to ask him directly.", { actions: [{ label: "Contact", run: function () { G.go("contact"); } }] });
        if (has(/\b(notice period|start date|when can (he|you) join|join)\b/)) return reply("That isn't on this page. Ask Gama directly: he's open to cloud / DevOps roles.", { actions: [{ label: "Contact", run: function () { G.go("contact"); } }] });
        if (has(/\b(certif|certificate|degree|education|college|university)\b/)) return reply("Certifications and education aren't listed on this page yet. The CV is the best place to check.", { actions: [{ label: "Download CV", run: G.openResume }] });

        /* core portfolio questions */
        if (has(/\b(why (should|would|do|hire)|should (we|i) hire|best (candidate|engineer|fit|hire)|are you the best|is (he|gama|madhu) the best|convince|the pitch|pitch me|strengths?|stand out|what makes|why gama|why madhu|why him)\b/)) {
            return reply("Fair question. Here is the unfiltered case for Madhu:\n\n" +
                "1. He learns by building: every single skill on this page is backed by a real, functional project (" + D.length + " completed, zero copied tutorials).\n" +
                "2. Automation-first: manual repetitive steps become automated CI/CD pipelines so your engineers don't have to wake up at 3 AM.\n" +
                "3. Sane reliability mindset: plans changes with Terraform before hitting apply, observes with Prometheus/Grafana, and keeps downtime at zero.\n" +
                "4. MMA discipline: knows how to take a beating from cryptic AWS IAM policies and remain calm under pressure.\n" +
                "5. Open to cloud / DevOps roles right now.\n\n" +
                "If you want someone who actually ships working infrastructure instead of just adding buzzwords to LinkedIn, say hello" + nm() + ".",
                { actions: [{ label: "Say hello", run: function () { G.go("contact"); } }, { label: "See the proof", run: function () { G.go("projects"); } }, { label: "Download CV", run: G.openResume }],
                  chips: ["Draft an intro email", "Which project fits my team?", "Roast Kubernetes", "Tell me a sarcastic joke", "Download CV"] });
        }
        if (has(/\b(tour|walk ?me|show me around|guide)\b/)) return tour();
        if (has(/\b(help|what can you|options|commands|what can i ask)\b/)) {
            return reply("I can:\n- welcome you and tailor suggestions\n- tell you why Gama is worth hiring\n- explain skills, tools and projects (try \"Do you know Terraform?\")\n- crack a joke, share a fun fact or run a 3-question quiz\n- draft an intro email to Gama\n- give a 30-second tour\nTip: Ctrl+K opens quick navigation anywhere.");
        }
        if (has(/\b(theme|dark mode|light mode)\b/)) {
            const b = document.getElementById("themeToggle"); if (b) b.click();
            return reply("Switched the theme for you.");
        }
        if (has(/\b(draft|write|compose)\b.*\b(email|message|intro)\b|\b(email|message|intro)\b.*\b(draft|write)\b/)) return draftEmail();
        if (has(/\b(resume|cv|curriculum)\b/)) return reply("You can download the CV from the hero section.", { actions: [{ label: "Download CV", run: G.openResume }] });
        if (has(/\b(contact|email|mail|reach|hire|hiring|available|availability|linkedin|github|connect|opportunit)/)) {
            const lines = ["Gama is open to cloud / DevOps opportunities. You can reach him here:"];
            const acts = [{ label: "Go to Contact", run: function () { G.go("contact"); } }];
            if (c.email) { lines.push("- Email: " + c.email); acts.push({ label: "Copy email", run: function () { G.copy(c.email, "Email"); } }); }
            if (c.github) { lines.push("- GitHub: " + c.github.replace(/^https?:\/\//, "")); acts.push({ label: "Open GitHub", run: function () { window.open(c.github, "_blank", "noopener"); } }); }
            if (c.linkedin) lines.push("- LinkedIn: via the contact section");
            if (!c.email && !c.linkedin) lines.push("- (More contact options will appear in the Contact section.)");
            acts.push({ label: "Draft an intro email", run: function () { ask("Draft an intro email"); } });
            return reply(lines.join("\n"), { actions: acts });
        }
        if (has(/\b(experience|years|how long|senior|junior)\b/)) {
            return reply("Gama has about a year of hands-on cloud and DevOps learning, backed by " + D.length + " completed project" + (D.length === 1 ? "" : "s") + " you can open in the Projects section.", { actions: [{ label: "Go to Projects", run: function () { G.go("projects"); } }] });
        }
        if (has(/\b(mma|hobby|hobbies|outside|free time|sport|martial)\b/)) return reply("Outside tech, Gama trains MMA. He says the same discipline applies to engineering: repetition, fundamentals and continuous improvement.");
        if (has(/\b(workflow|process|approach|how do you work|how does (gama|he) work|methodology)\b/)) {
            const steps = workflowSteps();
            return reply(steps.length ? "Gama's workflow, idea to production:\n" + steps.map(function (s, i) { return (i + 1) + ". " + s; }).join("\n") : "Check the Workflow section for how Gama works.",
                { actions: [{ label: "Go to Workflow", run: function () { G.go("workflow"); } }, { label: "Run the pipeline", run: function () { const b = G.$(".wf-run"); if (b) b.click(); } }] });
        }
        if (has(/\b(tools used most|most used|top tools|popular tools|used most)\b/)) {
            const u = usage();
            const top = Object.keys(u).sort(function (a, b) { return u[b] - u[a] || a.localeCompare(b); }).slice(0, 5);
            return reply(top.length ? "Across completed projects, the tools that show up most:\n" + top.map(function (k) { return "- " + k + ": " + u[k] + " project" + (u[k] > 1 ? "s" : ""); }).join("\n") : "No completed projects to measure yet.",
                { actions: [{ label: "See the Status window", run: function () { G.go("about"); } }] });
        }
        if (has(/\b(which project fits|fits (my|our) team|closest|most (complex|impressive)|best project|recommend)\b/)) return projectPicker();

        /* a skill area? (from the Skills cards) */
        const groups = skillGroups();
        for (let i = 0; i < groups.length; i++) {
            if (t.indexOf(groups[i].title.toLowerCase()) !== -1) {
                const g = groups[i];
                const lower = g.tools.map(function (x) { return x.toLowerCase(); });
                const used = D.filter(function (p) { return (p.technologies || []).some(function (x) { return lower.indexOf(String(x).toLowerCase()) !== -1; }); });
                return reply(g.title + ": " + g.tools.join(", ") + "." + (used.length ? "\nCompleted projects using these: " + used.slice(0, 3).map(function (p) { return p.title; }).join("; ") + "." : "\nNo completed project uses these yet, but they're in the toolbox."),
                    { actions: [{ label: "Go to Skills", run: function () { G.go("skills"); } }], chips: ["Which project fits my team?", "Tools used most", "Why hire Gama?", "Tell me a joke", "Contact"] });
            }
        }

        /* a specific project? */
        const exact = P().filter(function (p) { return p.title.toLowerCase() === t; })[0];
        const words = t.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w.length > 2; });
        let best = exact || null, bestScore = exact ? 99 : 0;
        if (!best) P().forEach(function (p) {
            const title = p.title.toLowerCase();
            const score = words.filter(function (w) { return title.indexOf(w) !== -1; }).length;
            if (score > bestScore) { best = p; bestScore = score; }
        });
        if (best && bestScore >= 2) {
            const d = describeProject(best);
            return reply(d.text, { actions: d.actions, chips: ["Which project fits my team?", "Tools used most", "Why hire Gama?", "Draft an intro email", "Tell me a joke"] });
        }

        /* a specific tool? */
        const idx = G.techIndex();
        const names = Object.keys(idx).sort(function (a, b) { return b.length - a.length; });
        for (let i = 0; i < names.length; i++) {
            const n = names[i];
            const re = new RegExp("(^|[^a-z0-9])" + n.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&") + "($|[^a-z0-9])");
            if (re.test(t)) {
                const hit = idx[n], d = hit.list.filter(G.isDone);
                if (d.length) {
                    return reply("Yes. " + hit.name + " appears in " + d.length + " completed project" + (d.length > 1 ? "s" : "") + ":\n" + d.slice(0, 4).map(function (p) { return "- " + p.title; }).join("\n"),
                        { actions: [{ label: "Show " + hit.name + " projects", run: function () { G.applyFilter(hit.name); G.go("projects"); } }], chips: ["Tools used most", "Which project fits my team?", "Do you know Kubernetes?", "Why hire Gama?", "Tell me a joke"] });
                }
                return reply(hit.name + " is part of Gama's toolkit, though no completed project uses it yet.", { actions: [{ label: "See all skills", run: function () { G.go("skills"); } }] });
            }
        }

        if (has(/\b(skill|skills|stack|tools|tech|technolog|good at|know|toolbox|expertise)\b/)) {
            return reply(groups.length ? "Gama's toolbox:\n" + groups.map(function (g) { return "- " + g.title + ": " + g.tools.slice(0, 6).join(", "); }).join("\n") + "\nWhich area matters most for your team?" : "Take a look at the Skills section for the full toolbox.",
                { actions: [{ label: "Go to Skills", run: function () { G.go("skills"); } }],
                  chips: groups.slice(0, 4).map(function (g) { return { label: shorten(g.title, 24), ask: "Tell me about " + g.title }; }).concat(["Tools used most"]) });
        }
        if (has(/\b(project|projects|built|build|portfolio|work|made|examples?|showcase)\b/)) {
            const r = await botSay("Gama has " + D.length + " completed project" + (D.length === 1 ? "" : "s") + (planned ? " and " + planned + " planned" : "") + ". Completed ones:\n" + D.slice(0, 5).map(function (p) { return "- " + p.title; }).join("\n"),
                [{ label: "Go to Projects", run: function () { G.go("projects"); } }]);
            if (r !== false) await projectPicker();
            return;
        }
        if (has(/\b(who|about|introduce|yourself|gama|madhu|gaddam|what does|what do you do)\b/)) {
            return reply("Gaddam Madhukanth (Madhu) is a Cloud & DevOps enthusiast focused on infrastructure automation, cloud architecture and reliable deployment systems. His approach combines cloud engineering, infrastructure as code, automation and continuous learning.",
                { actions: [{ label: "Read About", run: function () { G.go("about"); } }, { label: "See projects", run: function () { G.go("projects"); } }] });
        }

        /* not understood: suggest the closest things instead of a dead end */
        const q = {}; words.forEach(function (w) { q[w] = 1; });
        const scored = FAQ.map(function (f) {
            const hay = f[1].split(" ");
            return { label: f[0], score: hay.filter(function (h) { return q[h]; }).length };
        }).filter(function (s) { return s.score > 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 3);

        if (scored.length) {
            return reply("I'm not sure I caught that. Did you mean one of these? (I only know what's on this site.)", { chips: scored.map(function (s) { return s.label; }).concat(["Why hire Gama?", "Tell me a joke"]) });
        }
        return reply("My linter threw a 404 on that query. You speaking in binary or did your keyboard get possessed? I can answer questions about Madhu's skills and projects, roast Kubernetes, or crack another sarcastic joke.", { chips: ["Why hire Madhu?", "Tell me a sarcastic joke", "Roast Kubernetes", "Show projects", "Contact"] });
    }

    /* ---------- tour ---------- */
    const TOUR = [
        ["home", "Home: a quick intro plus a live terminal. Click it and type \"help\"."],
        ["about", "About: who Gama is, plus an Engineer Status window built from his real project data."],
        ["skills", "Skills: the toolbox by area. Hover a tool to see which projects use it."],
        ["projects", "Projects: filter by tool and open any card for details."],
        ["workflow", "Workflow: how an idea reaches production. Press \"Run the pipeline\" to watch it."],
        ["contact", "And Contact: the way to reach Gama. Thanks for visiting!"]
    ];

    async function tour() {
        open();
        const token = ++tourToken;
        await botSay("Great, here's a quick tour. Type \"stop\" any time.");
        for (let i = 0; i < TOUR.length; i++) {
            if (token !== tourToken) return;
            G.go(TOUR[i][0]);
            await botSay(TOUR[i][1]);
            await sleep(2600);
        }
        if (token === tourToken) await reply("That's everything. Want a joke, or shall I draft an intro email?");
    }

    /* ---------- conversation entry ---------- */
    function ask(q) {
        const text = String(q || "").trim();
        if (!text) return;
        if (/^(stop|cancel|quit)$/i.test(text)) {
            tourToken++; epoch++; pending = null; quiz = null;
            userSay(text);
            botSay("Okay, stopped.").then(function () { setChips(contextChips()); });
            return;
        }
        tourToken++;
        userSay(text);
        enqueue(function () { return route(text); });
    }

    function reset() {
        epoch++; tourToken++; pending = null; quiz = null;
        log.innerHTML = ""; chipsBox.innerHTML = "";
        started = true;
        enqueue(function () { return visitor.role ? reply("Fresh start" + nm() + "! What would you like to see?") : welcome(); });
    }

    /* ---------- open / close ---------- */
    function open() {
        if (isOpen) return;
        isOpen = true;
        panel.hidden = false;
        wrap.classList.add("open");
        launcher.setAttribute("aria-expanded", "true");
        launcher.setAttribute("aria-label", "Close assistant");
        dot.hidden = true;
        window.dispatchEvent(new Event("asst:open"));
        if (!started) {
            started = true;
            try { localStorage.setItem("gama-visited", "1"); } catch (e) {}
            enqueue(welcome);
        }
        setTimeout(function () { input.focus({ preventScroll: true }); }, 60);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        tourToken++; epoch++;
        panel.hidden = true;
        wrap.classList.remove("open");
        launcher.setAttribute("aria-expanded", "false");
        launcher.setAttribute("aria-label", "Open assistant");
        launcher.focus({ preventScroll: true });
    }

    launcher.addEventListener("click", function () { isOpen ? close() : open(); });
    wrap.querySelector(".asst-close").addEventListener("click", close);
    wrap.querySelector(".asst-restart").addEventListener("click", reset);
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); } });
    form.addEventListener("submit", function (e) { e.preventDefault(); const v = input.value; input.value = ""; ask(v); });

    /* ---------- the ghost watches the cursor ---------- */
    const pupils = G.$$(".asst-launcher .g-pupil");
    window.addEventListener("pointermove", function (e) {
        if (e.pointerType && e.pointerType !== "mouse") return;
        const r = launcher.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1, k = Math.min(3.2, d / 90);
        pupils.forEach(function (p) { p.style.transform = "translate(" + (dx / d) * k + "px," + (dy / d) * k + "px)"; });
    });

    window.mascotHop = function () {
        launcher.classList.remove("hop"); void launcher.offsetWidth; launcher.classList.add("hop");
    };

    /* ---------- non-intrusive teaser bubble ---------- */
    let teaserShown = false;
    setTimeout(function () {
        if (isOpen || started || sessionStorage.getItem("asst-teased") === "1") return;
        teaserShown = true;
        const teaser = document.createElement("div");
        teaser.className = "asst-teaser";
        teaser.innerHTML = '<span>Need a laugh or cloud reality check? &#128123;</span><button type="button" class="asst-teaser-close" aria-label="Dismiss">&times;</button>';
        teaser.addEventListener("click", function (e) {
            if (e.target.closest(".asst-teaser-close")) {
                teaser.remove();
                sessionStorage.setItem("asst-teased", "1");
                return;
            }
            teaser.remove();
            sessionStorage.setItem("asst-teased", "1");
            open();
        });
        wrap.appendChild(teaser);
        setTimeout(function () {
            if (teaser.parentElement) {
                teaser.style.opacity = "0";
                setTimeout(function () { teaser.remove(); }, 350);
            }
        }, 9000);
    }, 4500);

    window.GamaAssistant = { open: open, close: close, tour: tour, isOpen: function () { return isOpen; }, ask: function (q) { open(); ask(q); } };
}
