/* =========================================================
   PROJECT DATABASE
   ========================================================= */

const projects = [

    // =====================================================
    // FEATURED / AWS
    // =====================================================

    {
        title: "Production CI/CD Pipeline",

        categories: [
            "AWS",
            "DevOps",
            "CI/CD"
        ],

        featured: true,

        /*
         * PROJECT POSTER
         *
         * Leave empty until you have an image.
         *
         * Example:
         * poster: "assets/projects/cicd-pipeline.png",
         */
        poster: "assets/projects/sample.png",

        description:
            "Production-grade CI/CD pipeline for automated application deployment using AWS CodePipeline and CodeBuild.",

        technologies: [
            "AWS",
            "CodePipeline",
            "CodeBuild",
            "S3",
            "IAM"
        ],

        icon:
            "devicon-amazonwebservices-plain colored",

        status:
            "Completed",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AWS / DEVOPS / CI/CD",

            overview:
                "Automated application delivery pipeline built using AWS CodePipeline and CodeBuild, with supporting S3 storage and IAM permissions.",

            implementation:
                "GitHub → AWS CodePipeline → AWS CodeBuild → Deployment\n\nInfrastructure and supporting resources are managed with AWS services and Terraform.",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture:
                "assets/projects/sample.png",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/production-cicd-01.png",
                // "assets/projects/production-cicd-02.png"

            ]
        }
    },


    // =====================================================
    // AWS / TERRAFORM
    // =====================================================

    {
        title: "AWS Infrastructure with Terraform",

        categories: [
            "AWS",
            "Terraform"
        ],

        featured: true,

        poster: "",

        description:
            "Reusable AWS infrastructure provisioned through Terraform modules with remote state management.",

        technologies: [
            "Terraform",
            "AWS",
            "S3",
            "IAM"
        ],

        icon:
            "devicon-terraform-plain colored",

        status:
            "Completed",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AWS / TERRAFORM",

            overview:
                "Reusable AWS infrastructure provisioned through Terraform modules with remote state management and structured infrastructure configuration.",

            implementation:
                "Terraform configuration\n├── Provider configuration\n├── Reusable modules\n├── Variables\n├── Outputs\n└── Remote state\n\nInfrastructure is provisioned through Terraform instead of manually creating AWS resources.",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture:
                "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/terraform-01.png",
                // "assets/projects/terraform-02.png"

            ]
        }
    },


    // =====================================================
    // AWS / DOCKER
    // =====================================================

    {
        title: "Containerized Job Processor",

        categories: [
            "AWS",
            "Docker",
            "DevOps"
        ],

        featured: true,

        poster: "",

        description:
            "Containerized asynchronous job processing system using Python, Docker, Amazon SQS and EC2.",

        technologies: [
            "Docker",
            "Python",
            "SQS",
            "EC2"
        ],

        icon:
            "devicon-docker-plain colored",

        status:
            "Completed",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AWS / DOCKER / DEVOPS",

            overview:
                "Asynchronous job processing system using a Python worker, Docker containers, Amazon SQS and an EC2 application server.",

            implementation:
                "Application → Amazon SQS → EC2 Worker → Job Processing\n\nFailed jobs can be routed through the queue's dead-letter queue for further handling.",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/job-processor-01.png",
                // "assets/projects/job-processor-02.png"

            ]
        }
    },


    // =====================================================
    // THREE-TIER AWS
    // =====================================================

    {
        title: "Three-Tier AWS Architecture",

        categories: [
            "AWS",
            "Terraform"
        ],

        featured: true,

        poster: "",

        description:
            "Highly available three-tier architecture designed and provisioned using Terraform.",

        technologies: [
            "AWS",
            "Terraform",
            "EC2",
            "RDS",
            "VPC"
        ],

        icon:
            "devicon-amazonwebservices-plain colored",

        status:
            "Planned",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AWS / TERRAFORM / ARCHITECTURE",

            overview:
                "Three-tier AWS architecture separating the presentation, application and database layers.",

            implementation:
                "Users → Presentation Layer → Application Layer → Database Layer\n\nTerraform is used to define and provision the infrastructure.",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/three-tier-01.png",
                // "assets/projects/three-tier-02.png"

            ]
        }
    },


    // =====================================================
    // AZURE DEVOPS
    // =====================================================

    {
        title: "Azure DevOps Pipeline",

        categories: [
            "Azure",
            "DevOps",
            "CI/CD"
        ],

        featured: true,

        poster: "",

        description:
            "Automated build and deployment workflow using Azure DevOps and cloud infrastructure.",

        technologies: [
            "Azure",
            "Azure Pipelines",
            "Terraform"
        ],

        icon:
            "devicon-azure-plain colored",

        status:
            "In Progress",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AZURE / DEVOPS / CI/CD",

            overview:
                "Automated build and deployment workflow using Azure DevOps with infrastructure managed through Terraform.",

            implementation:
                "Source Repository → Azure Pipeline → Build → Deployment\n\nTerraform is used for infrastructure provisioning.",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/azure-devops-01.png",
                // "assets/projects/azure-devops-02.png"

            ]
        }
    },


    // =====================================================
    // AZURE VNET
    // =====================================================

    {
        title: "Azure VNet Infrastructure",

        categories: [
            "Azure",
            "Terraform"
        ],

        featured: false,

        poster: "",

        description:
            "Azure virtual network infrastructure provisioned using Terraform with structured networking components.",

        technologies: [
            "Azure",
            "VNet",
            "Terraform"
        ],

        icon:
            "devicon-azure-plain colored",

        status:
            "Completed",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AZURE / TERRAFORM / NETWORKING",

            overview:
                "Azure virtual network infrastructure provisioned through Terraform with structured networking components.",

            implementation:
                "Terraform → Azure Resource Group → Virtual Network → Networking Components",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/azure-vnet-01.png",
                // "assets/projects/azure-vnet-02.png"

            ]
        }
    },


    // =====================================================
    // KUBERNETES / EKS
    // =====================================================

    {
        title: "Production EKS Platform",

        categories: [
            "AWS",
            "Kubernetes",
            "Terraform"
        ],

        featured: true,

        poster: "",

        description:
            "Kubernetes platform provisioned on Amazon EKS using Terraform and cloud-native infrastructure practices.",

        technologies: [
            "EKS",
            "Kubernetes",
            "Terraform",
            "AWS"
        ],

        icon:
            "devicon-kubernetes-plain colored",

        status:
            "In Progress",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AWS / KUBERNETES / TERRAFORM",

            overview:
                "Kubernetes platform designed around Amazon EKS with infrastructure provisioned through Terraform.",

            implementation:
                "Terraform → AWS Infrastructure → EKS Cluster → Kubernetes Workloads",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/eks-01.png",
                // "assets/projects/eks-02.png"

            ]
        }
    },


    // =====================================================
    // JENKINS / CI-CD
    // =====================================================

    {
        title: "Jenkins CI/CD Pipeline",

        categories: [
            "Jenkins",
            "CI/CD",
            "DevOps"
        ],

        featured: false,

        poster: "",

        description:
            "Automated CI/CD pipeline using Jenkins for building, testing and deploying applications.",

        technologies: [
            "Jenkins",
            "Git",
            "Docker",
            "AWS"
        ],

        icon:
            "devicon-jenkins-line colored",

        status:
            "Planned",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "JENKINS / CI/CD / DEVOPS",

            overview:
                "Automated CI/CD workflow using Jenkins to build, test and deploy applications.",

            implementation:
                "Git → Jenkins → Build → Test → Docker → Deployment",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/jenkins-01.png",
                // "assets/projects/jenkins-02.png"

            ]
        }
    },


    // =====================================================
    // DEVSECOPS
    // =====================================================

    {
        title: "Secure CI/CD Pipeline",

        categories: [
            "DevSecOps",
            "DevOps",
            "CI/CD"
        ],

        featured: true,

        poster: "",

        description:
            "Secure CI/CD workflow incorporating automated security checks and deployment controls.",

        technologies: [
            "GitHub Actions",
            "Security",
            "CI/CD"
        ],

        icon:
            "devicon-github-original",

        status:
            "Planned",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "DEVSECOPS / CI/CD",

            overview:
                "CI/CD workflow designed with automated security checks and deployment controls integrated into the delivery process.",

            implementation:
                "GitHub → CI Pipeline → Security Checks → Build → Deployment",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/devsecops-01.png",
                // "assets/projects/devsecops-02.png"

            ]
        }
    },


    // =====================================================
    // OBSERVABILITY
    // =====================================================

    {
        title: "Cloud Monitoring & Alerts",

        categories: [
            "AWS",
            "Observability"
        ],

        featured: true,

        poster: "",

        description:
            "Cloud monitoring system using metrics, logs and automated alerting for infrastructure visibility.",

        technologies: [
            "CloudWatch",
            "SNS",
            "Logs",
            "Metrics"
        ],

        icon:
            "devicon-amazonwebservices-plain colored",

        status:
            "Planned",

        github:
            "https://github.com/builtbygama",

        detail: {

            category:
                "AWS / OBSERVABILITY",

            overview:
                "Cloud monitoring setup using metrics, logs and automated notifications to provide infrastructure visibility.",

            implementation:
                "AWS Resources → CloudWatch Metrics / Logs → Alarms → SNS Notifications",

            // =================================================
            // ARCHITECTURE IMAGE
            // =================================================

            architecture: "",

            // =================================================
            // SCREENSHOTS
            // =================================================

            screenshots: [

                // "assets/projects/cloudwatch-01.png",
                // "assets/projects/cloudwatch-02.png"

            ]
        }
    }

];



/* =========================================================
   PROJECT SETTINGS
   ========================================================= */

const PROJECT_SETTINGS = {

    featuredLimit: 8,

    categoryPageSize: 8,

    defaultCategory: "Featured"

};



/* =========================================================
   DOM ELEMENTS
   ========================================================= */

let projectFilters;
let projectsGrid;
let projectsCount;
let projectsCurrentCategory;
let projectsEmpty;
let projectsLoadMore;
let loadMoreProjects;



/* =========================================================
   PROJECT DETAIL ELEMENTS
   ========================================================= */

let projectDetail;
let projectDetailClose;

let projectDetailCategory;
let projectDetailTitle;
let projectDetailDescription;

let projectDetailImage;

let projectDetailOverview;
let projectDetailTechnologies;
let projectDetailImplementation;

let projectDetailEvidence;
let projectDetailScreenshots;

let projectDetailGithub;
let projectDetailLive;



/* =========================================================
   INITIALIZE PROJECT SECTION
   ========================================================= */

function initProjects() {

    projectFilters =
        document.getElementById("projectFilters");

    projectsGrid =
        document.getElementById("projectsGrid");

    projectsCount =
        document.getElementById("projectsCount");

    projectsCurrentCategory =
        document.getElementById(
            "projectsCurrentCategory"
        );

    projectsEmpty =
        document.getElementById("projectsEmpty");

    projectsLoadMore =
        document.getElementById("projectsLoadMore");

    loadMoreProjects =
        document.getElementById("loadMoreProjects");


    /* =====================================================
       PROJECT DETAIL ELEMENTS
       ===================================================== */

    projectDetail =
        document.getElementById("projectDetail");

    projectDetailClose =
        document.getElementById("projectDetailClose");

    projectDetailCategory =
        document.getElementById(
            "projectDetailCategory"
        );

    projectDetailTitle =
        document.getElementById("projectDetailTitle");

    projectDetailDescription =
        document.getElementById(
            "projectDetailDescription"
        );

    projectDetailImage =
        document.getElementById("projectDetailImage");

    projectDetailOverview =
        document.getElementById(
            "projectDetailOverview"
        );

    projectDetailTechnologies =
        document.getElementById(
            "projectDetailTechnologies"
        );

    projectDetailImplementation =
        document.getElementById(
            "projectDetailImplementation"
        );

    projectDetailEvidence =
        document.getElementById(
            "projectDetailEvidence"
        );

    projectDetailScreenshots =
        document.getElementById(
            "projectDetailScreenshots"
        );

    projectDetailGithub =
        document.getElementById(
            "projectDetailGithub"
        );

    projectDetailLive =
        document.getElementById(
            "projectDetailLive"
        );


    /* =====================================================
       LOAD MORE
       ===================================================== */

    if (loadMoreProjects) {

        loadMoreProjects.addEventListener(
            "click",
            loadMore
        );

    }


    /* =====================================================
       CLOSE PROJECT DETAIL
       ===================================================== */

    if (projectDetailClose) {

        projectDetailClose.addEventListener(
            "click",
            closeProjectDetail
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    if (!projectFilters || !projectsGrid) {

        console.warn(
            "Projects section could not be initialized."
        );

        return;
    }

    createCategoryButtons();

    showProjects(
        PROJECT_SETTINGS.defaultCategory
    );
}



/* =========================================================
   GET CATEGORIES
   ========================================================= */

function getProjectCategories() {

    const categories = new Set();

    projects.forEach(project => {

        project.categories.forEach(category => {

            categories.add(category);

        });

    });

    return [
        PROJECT_SETTINGS.defaultCategory,
        ...categories
    ];
}



/* =========================================================
   CREATE CATEGORY BUTTONS
   ========================================================= */

function createCategoryButtons() {

    projectFilters.innerHTML = "";

    const categories =
        getProjectCategories();

    categories.forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "project-filter";

        button.type =
            "button";

        button.textContent =
            category;

        button.dataset.category =
            category;

        if (
            category ===
            PROJECT_SETTINGS.defaultCategory
        ) {

            button.classList.add("active");

        }

        button.addEventListener(
            "click",
            () => {

                setActiveFilter(button);

                showProjects(category);

            }
        );

        projectFilters.appendChild(button);

    });
}



/* =========================================================
   ACTIVE FILTER
   ========================================================= */

function setActiveFilter(activeButton) {

    const buttons =
        projectFilters.querySelectorAll(
            ".project-filter"
        );

    buttons.forEach(button => {

        button.classList.remove("active");

    });

    activeButton.classList.add("active");
}



/* =========================================================
   FILTER PROJECTS
   ========================================================= */

function getFilteredProjects(category) {

    if (
        category ===
        PROJECT_SETTINGS.defaultCategory
    ) {

        return projects
            .filter(project => project.featured)
            .slice(
                0,
                PROJECT_SETTINGS.featuredLimit
            );
    }

    return projects.filter(project =>
        project.categories.includes(category)
    );
}



/* =========================================================
   CURRENT CATEGORY
   ========================================================= */

let currentCategory =
    PROJECT_SETTINGS.defaultCategory;

let visibleProjectCount =
    PROJECT_SETTINGS.featuredLimit;



/* =========================================================
   SHOW PROJECTS
   ========================================================= */

function showProjects(category) {

    currentCategory =
        category;

    visibleProjectCount =
        category ===
        PROJECT_SETTINGS.defaultCategory

            ? PROJECT_SETTINGS.featuredLimit

            : PROJECT_SETTINGS.categoryPageSize;

    renderProjects();
}



/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects() {

    if (!projectsGrid) {
        return;
    }

    const allProjects =
        getFilteredProjects(
            currentCategory
        );

    const visibleProjects =
        allProjects.slice(
            0,
            visibleProjectCount
        );


    projectsGrid.innerHTML =
        "";


    if (projectsCurrentCategory) {

        projectsCurrentCategory.textContent =
            currentCategory;

    }


    if (projectsCount) {

        const count =
            allProjects.length;

        projectsCount.textContent =
            `${count} ${
                count === 1
                    ? "Project"
                    : "Projects"
            }`;
    }


    if (projectsEmpty) {

        projectsEmpty.hidden =
            allProjects.length !== 0;

    }


    visibleProjects.forEach(
        project => {

            const card =
                createProjectCard(project);

            projectsGrid.appendChild(card);

        }
    );


    updateLoadMore(
        allProjects.length
    );
}



/* =========================================================
   LOAD MORE
   ========================================================= */

function loadMore() {

    visibleProjectCount +=
        PROJECT_SETTINGS.categoryPageSize;

    renderProjects();
}



/* =========================================================
   LOAD MORE BUTTON
   ========================================================= */

function updateLoadMore(totalProjects) {

    if (!projectsLoadMore) {
        return;
    }


    if (
        currentCategory ===
        PROJECT_SETTINGS.defaultCategory
    ) {

        projectsLoadMore.hidden =
            true;

        return;
    }


    if (
        visibleProjectCount <
        totalProjects
    ) {

        projectsLoadMore.hidden =
            false;

    } else {

        projectsLoadMore.hidden =
            true;

    }
}



/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(project) {

    const article =
        document.createElement("article");

    article.className =
        "project-card";


    /* =====================================================
       PROJECT POSTER
       ===================================================== */

    const poster =
        document.createElement("div");

    poster.className =
        "project-poster";


    /*
     * If a poster exists,
     * display the project image.
     */

    if (
        project.poster &&
        project.poster.trim() !== ""
    ) {

        const image =
            document.createElement("img");

        image.src =
            project.poster;

        image.alt =
            `${project.title} project poster`;

        image.loading =
            "lazy";

        poster.appendChild(
            image
        );

    }


    /*
     * No poster yet.
     * Display placeholder.
     */

    else {

        poster.classList.add(
            "project-poster-empty"
        );

        poster.innerHTML = `
            <div class="project-poster-placeholder">
                <span>PROJECT</span>
            </div>
        `;

    }


    /* =====================================================
       PROJECT CONTENT
       ===================================================== */

    const content =
        document.createElement("div");

    content.className =
        "project-card-content";


    /* =====================================================
       TOP
       ===================================================== */

    const top =
        document.createElement("div");

    top.className =
        "project-top";


    const status =
        document.createElement("span");

    status.className =
        "project-status";

    status.textContent =
        project.status;


    top.appendChild(
        status
    );


    /* =====================================================
       ICON
       ===================================================== */

    const icon =
        document.createElement("div");

    icon.className =
        "project-icon";

    icon.innerHTML =
        `<i class="${project.icon}"></i>`;


    /* =====================================================
       TITLE
       ===================================================== */

    const title =
        document.createElement("h3");

    title.textContent =
        project.title;


    /* =====================================================
       DESCRIPTION
       ===================================================== */

    const description =
        document.createElement("p");

    description.textContent =
        project.description;


    /* =====================================================
       TECHNOLOGIES
       ===================================================== */

    const stack =
        document.createElement("div");

    stack.className =
        "project-stack";


    project.technologies.forEach(
        technology => {

            const tag =
                document.createElement("span");

            tag.textContent =
                technology;

            stack.appendChild(
                tag
            );

        }
    );


    /* =====================================================
       FOOTER
       ===================================================== */

    const footer =
        document.createElement("div");

    footer.className =
        "project-footer";


    const categories =
        document.createElement("span");

    categories.className =
        "project-categories";


    project.categories.forEach(
        category => {

            const categoryTag =
                document.createElement("span");

            categoryTag.textContent =
                category;

            categories.appendChild(
                categoryTag
            );

        }
    );


    /* =====================================================
       PROJECT BUTTON
       ===================================================== */

    const projectButton =
        document.createElement("button");

    projectButton.type =
        "button";

    projectButton.className =
        "project-link";

    projectButton.innerHTML =
        `View Project <span>→</span>`;


    projectButton.addEventListener(
        "click",
        () => {

            openProjectDetail(
                project
            );

        }
    );


    /* =====================================================
       FOOTER ASSEMBLY
       ===================================================== */

    footer.appendChild(
        categories
    );

    footer.appendChild(
        projectButton
    );


    /* =====================================================
       CONTENT ASSEMBLY
       ===================================================== */

    content.appendChild(
        top
    );

    content.appendChild(
        icon
    );

    content.appendChild(
        title
    );

    content.appendChild(
        description
    );

    content.appendChild(
        stack
    );

    content.appendChild(
        footer
    );


    /* =====================================================
       CARD ASSEMBLY
       ===================================================== */

    article.appendChild(
        poster
    );

    article.appendChild(
        content
    );


    return article;
}



/* =========================================================
   OPEN PROJECT DETAIL
   ========================================================= */

function openProjectDetail(project) {

    if (!projectDetail) {
        return;
    }


    const detail =
        project.detail || {};


    /* =====================================================
       BASIC INFORMATION
       ===================================================== */

    if (projectDetailCategory) {

        projectDetailCategory.textContent =
            detail.category ||
            project.categories.join(" / ");

    }


    if (projectDetailTitle) {

        projectDetailTitle.textContent =
            project.title;

    }


    if (projectDetailDescription) {

        projectDetailDescription.textContent =
            project.description;

    }


    if (projectDetailOverview) {

        projectDetailOverview.textContent =
            detail.overview ||
            project.description;

    }


    /* =====================================================
       TECHNOLOGIES
       ===================================================== */

    if (projectDetailTechnologies) {

        projectDetailTechnologies.innerHTML =
            project.technologies
                .map(
                    technology => `
                        <span>
                            ${technology}
                        </span>
                    `
                )
                .join("");

    }


    /* =====================================================
       IMPLEMENTATION
       ===================================================== */

    if (projectDetailImplementation) {

        projectDetailImplementation.textContent =
            detail.implementation || "";

    }


    /* =====================================================
       ARCHITECTURE IMAGE
       ===================================================== */

    if (projectDetailImage) {

        if (detail.architecture) {

            projectDetailImage.src =
                detail.architecture;

            projectDetailImage.alt =
                `${project.title} architecture`;

            if (
                projectDetailImage.parentElement
            ) {

                projectDetailImage.parentElement.hidden =
                    false;

            }

        } else {

            projectDetailImage.removeAttribute(
                "src"
            );

            projectDetailImage.alt =
                "";

            if (
                projectDetailImage.parentElement
            ) {

                projectDetailImage.parentElement.hidden =
                    true;

            }

        }
    }


    /* =====================================================
       SCREENSHOTS
       ===================================================== */

    if (projectDetailScreenshots) {

        projectDetailScreenshots.innerHTML =
            "";

        const screenshots =
            detail.screenshots || [];


        screenshots.forEach(
            (screenshot, index) => {

                const figure =
                    document.createElement(
                        "figure"
                    );

                figure.className =
                    "project-detail-screenshot";


                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    screenshot;

                image.alt =
                    `${project.title} screenshot ${index + 1}`;

                image.loading =
                    "lazy";


                figure.appendChild(
                    image
                );

                projectDetailScreenshots.appendChild(
                    figure
                );

            }
        );


        if (projectDetailEvidence) {

            projectDetailEvidence.hidden =
                screenshots.length === 0;

        }

    }


    /* =====================================================
       GITHUB
       ===================================================== */

    if (projectDetailGithub) {

        projectDetailGithub.href =
            project.github || "#";

    }


    /* =====================================================
       LIVE DEPLOYMENT
       ===================================================== */

    if (projectDetailLive) {

        if (project.live) {

            projectDetailLive.href =
                project.live;

            projectDetailLive.hidden =
                false;

        } else {

            projectDetailLive.hidden =
                true;

        }

    }


    /* =====================================================
       SHOW DETAIL
       ===================================================== */

    projectDetail.hidden =
        false;


    requestAnimationFrame(
        () => {

            projectDetail.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );
}



/* =========================================================
   CLOSE PROJECT DETAIL
   ========================================================= */

function closeProjectDetail() {

    if (!projectDetail) {
        return;
    }


    projectDetail.hidden =
        true;


    const projectsSection =
        document.getElementById(
            "projects"
        );


    if (projectsSection) {

        projectsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}



/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            projectDetail &&
            !projectDetail.hidden
        ) {

            closeProjectDetail();

        }

    }
);