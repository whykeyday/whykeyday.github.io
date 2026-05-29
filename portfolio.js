const projects = {
    echoes: {
        kicker: "Playable game",
        title: "Echoes of Past",
        description: "A 2D pixel story game about a protagonist who discovers time travel after losing his parents. The player investigates old moments, gathers clues, and changes the outcome through memory and evidence.",
        tags: ["GameMaker", "Pixel Art", "Puzzle", "Narrative", "Multiple Endings"],
        primary: "https://gx.games/games/2upm5i/echoes-of-past/",
        primaryLabel: "Play on GX Games",
        secondary: "https://keyinggamedesign.itch.io/echoes-of-past",
        secondaryLabel: "View Itch.io Page",
        preview: "linear-gradient(145deg, #17233a 0%, #31567d 42%, #f6a1bc 100%)",
        media: "launch"
    },
    media2d: {
        kicker: "2D gallery",
        title: "2D Media Showcase",
        description: "A portfolio gallery spanning Adobe Illustrator, 2D painting, character design, Photoshop, Procreate, Toon Boom Harmony, rotoscoping, walk cycles, and morphing animation.",
        tags: ["Illustration", "Animation", "Character Design", "Harmony", "Procreate"],
        primary: "final/2D/index.html",
        primaryLabel: "Open 2D Gallery",
        secondary: "https://www.youtube.com/@keyingdai",
        secondaryLabel: "Watch Videos",
        preview: "url('final/2D/coco.jpg')",
        media: "image"
    },
    viewer3d: {
        kicker: "3D work",
        title: "My Virtual Gallery / 3D Viewer",
        description: "An interactive 3D viewing space for models, motion, and world-building experiments. It reflects Keying's interest in spatial presentation and immersive portfolio systems.",
        tags: ["3D Modeling", "Maya", "Blender", "Three.js", "Motion"],
        primary: "final/3d-viewer.html",
        primaryLabel: "Open 3D Viewer",
        secondary: "https://www.artstation.com/keyingdai",
        secondaryLabel: "ArtStation",
        preview: "linear-gradient(145deg, #d8f4fb 0%, #fffefe 45%, #ffd3df 100%)",
        media: "pastel"
    },
    beyond: {
        kicker: "UI/UX prototype",
        title: "Beyond Life",
        description: "A health-focused app concept developed through research, surveys, personas, user stories, app flowcharts, wireframes, color systems, typography, and prototyping.",
        tags: ["UI/UX", "User Flow", "Research", "Prototype", "Health App"],
        primary: "https://lifebeyondsuperapp.wixsite.com/beyondlife",
        primaryLabel: "Open UX Project",
        secondary: "https://www.linkedin.com/in/keying-dai/",
        secondaryLabel: "LinkedIn",
        preview: "linear-gradient(145deg, #c8f0db 0%, #d8f4fb 48%, #ffd3df 100%)",
        media: "pastel"
    },
    installation: {
        kicker: "Installation art",
        title: "Installation Showcase",
        description: "A mixed-media installation archive including Time, Eastern Blessing, Silenced Mourning, Free-doom, and ECO-Echo. The work focuses on space, material, audience, and emotional meaning.",
        tags: ["Installation", "Mixed Media", "Spatial Design", "Audience Experience"],
        primary: "final/install/index.html",
        primaryLabel: "Open Installation",
        secondary: "https://www.youtube.com/@keyingdai",
        secondaryLabel: "Video Channel",
        preview: "url('final/install/box_0.jpg')",
        media: "image"
    },
    demo2: {
        kicker: "Project demo",
        title: "Project Demo 2 - Ketchup's Leisurely Life",
        description: "An interactive web project built around a playful autobiographical cat-world, using tabs, parallax, flip cards, video, and confetti interactions.",
        tags: ["Project Demo 2", "p5.js", "Parallax", "Interactive Page"],
        primary: "assignment2/index.html",
        primaryLabel: "Open Project Demo 2",
        secondary: "assignment2/photos/00.jpg",
        secondaryLabel: "View Asset",
        preview: "url('assignment2/photos/00.jpg')",
        media: "image"
    },
    demo34: {
        kicker: "Project demos",
        title: "Project Demo 3 & 4",
        description: "Project Demo 3 gathers mini games, including Snake, Tetris, 2048, and a gate interaction. Project Demo 4 is a sign-in and fireworks interaction for a playful hall of fame.",
        tags: ["Project Demo 3", "Project Demo 4", "Games", "DOM Interaction", "p5.js"],
        primary: "assignment3/index.html",
        primaryLabel: "Open Project Demo 3",
        secondary: "assignment4/index.html",
        secondaryLabel: "Open Project Demo 4",
        preview: "url('assignment3/snake.png')",
        media: "image"
    },
    breath: {
        kicker: "VR game",
        title: "Breath to Restore",
        description: "A VR / Android experience where breathing and touch repair symbolic environments. Players move from a black hub through glass shards into underwater, withered-tree, and cat-themed worlds.",
        tags: ["VR", "Android", "Embodied Interaction", "Unity", "Environment"],
        primary: "https://keyinggamedesign.itch.io/breath-to-restore",
        primaryLabel: "Open Itch.io Page",
        secondary: "https://keyinggamedesign.itch.io/",
        secondaryLabel: "Game Portfolio",
        preview: "linear-gradient(145deg, #17233a 0%, #9edcf2 48%, #c8f0db 100%)",
        media: "pastel"
    },
    grain: {
        kicker: "Educational game",
        title: "Against the Grain - The O2 Journey",
        description: "An educational adventure and visual storybook following a brave oxygen molecule through possible fates on Earth. It turns scientific information into an approachable micro-world.",
        tags: ["Unity", "Science Story", "HTML5", "Adventure", "Education"],
        primary: "https://keyinggamedesign.itch.io/against-the-grain",
        primaryLabel: "Open Itch.io Page",
        secondary: "https://keyinggamedesign.itch.io/",
        secondaryLabel: "Game Portfolio",
        preview: "linear-gradient(145deg, #fffefe 0%, #ffe7a6 48%, #9edcf2 100%)",
        media: "pastel"
    },
    pull: {
        kicker: "Interactive fiction",
        title: "Pull or Let Go",
        description: "A Twine-based story about a new semester, a transfer student, social pressure, and bullying. Choices shape the transfer student's fate and the player's own path.",
        tags: ["Twine", "Interactive Fiction", "Ethical Choice", "Visual Novel"],
        primary: "https://keyinggamedesign.itch.io/pull-or-let-go",
        primaryLabel: "Open Itch.io Page",
        secondary: "https://keyinggamedesign.itch.io/",
        secondaryLabel: "Game Portfolio",
        preview: "linear-gradient(145deg, #ffd3df 0%, #fffefe 46%, #d8f4fb 100%)",
        media: "pastel"
    }
};

const tags = (project) => project.tags.map((tag) => `<span>${tag}</span>`).join("");

const panelTitle = document.getElementById("panel-title");
const panelDescription = document.getElementById("panel-description");
const panelTags = document.getElementById("panel-tags");
const panelPreview = document.getElementById("panel-preview");
const panelLink = document.getElementById("panel-link");
const openProjectButton = document.getElementById("open-project");
const projectPanel = document.querySelector(".project-panel");
const panelClose = document.querySelector(".panel-close");
const panelPrev = document.getElementById("panel-prev");
const panelNext = document.getElementById("panel-next");
const panelDots = document.getElementById("panel-dots");
const projectToggle = document.querySelector(".project-toggle");
const modal = document.getElementById("project-modal");
const modalKicker = document.getElementById("modal-kicker");
const modalTitle = document.getElementById("modal-title");
const modalCopy = document.getElementById("modal-copy");
const modalTags = document.getElementById("modal-tags");
const modalMedia = document.getElementById("modal-media");
const modalPrimary = document.getElementById("modal-primary");
const modalSecondary = document.getElementById("modal-secondary");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const railLinks = Array.from(document.querySelectorAll(".left-rail a[href^='#']"));
const sliderProjectIds = ["echoes", "media2d", "viewer3d", "beyond", "installation", "demo2", "demo34", "breath", "grain", "pull"];
let currentProjectId = "echoes";
let panelUserHidden = false;
let panelAvailable = false;
let autoSlideTimer;

function setPreview(target, project) {
    target.innerHTML = "";
    const preview = document.createElement("div");
    preview.className = project.media === "launch" ? "preview-art launch-preview" : "preview-art";
    preview.style.setProperty("--preview", project.preview);
    target.append(preview);
}

function selectProject(id, openModal = false) {
    const project = projects[id];
    if (!project) return;

    currentProjectId = id;
    if (!panelUserHidden) {
        projectPanel.classList.remove("is-hidden");
    }
    panelTitle.textContent = project.title;
    panelDescription.textContent = project.description;
    panelTags.innerHTML = tags(project);
    panelLink.href = project.secondary || project.primary;
    panelLink.textContent = project.secondaryLabel || "External Link";
    openProjectButton.textContent = project.primaryLabel || "Open Project";
    setPreview(panelPreview, project);

    document.querySelectorAll(".artifact").forEach((artifact) => {
        artifact.classList.toggle("active", artifact.dataset.project === id);
    });
    updatePanelDots();

    if (openModal) {
        openProjectModal(id);
    }
}

function slideToProject(id, options = {}) {
    const { openModal = false, animate = true } = options;
    if (!projects[id]) return;

    if (!animate) {
        selectProject(id, openModal);
        return;
    }

    projectPanel.classList.add("is-sliding");
    window.setTimeout(() => {
        selectProject(id, openModal);
        projectPanel.classList.remove("is-sliding");
    }, 180);
}

function currentSliderIndex() {
    return Math.max(0, sliderProjectIds.indexOf(currentProjectId));
}

function moveProject(direction) {
    const nextIndex = (currentSliderIndex() + direction + sliderProjectIds.length) % sliderProjectIds.length;
    slideToProject(sliderProjectIds[nextIndex]);
    restartAutoSlide();
}

function updatePanelDots() {
    if (!panelDots) return;
    panelDots.querySelectorAll("button").forEach((button) => {
        const isActive = button.dataset.project === currentProjectId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "true" : "false");
    });
}

function buildPanelDots() {
    const fragment = document.createDocumentFragment();
    sliderProjectIds.forEach((id) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.project = id;
        button.setAttribute("aria-label", `Show ${projects[id].title}`);
        button.addEventListener("click", () => {
            slideToProject(id);
            restartAutoSlide();
        });
        fragment.append(button);
    });
    panelDots.append(fragment);
}

function restartAutoSlide() {
    window.clearInterval(autoSlideTimer);
    autoSlideTimer = window.setInterval(() => {
        if (!panelAvailable || panelUserHidden || !modal.hidden) return;
        const nextIndex = (currentSliderIndex() + 1) % sliderProjectIds.length;
        slideToProject(sliderProjectIds[nextIndex]);
    }, 10000);
}

function updateFloatingPanelState() {
    const scene = document.getElementById("scene");
    panelAvailable = scene.getBoundingClientRect().bottom < window.innerHeight * 0.68;
    projectPanel.classList.toggle("is-floating", panelAvailable && !panelUserHidden);
    projectToggle.classList.toggle("is-visible", panelAvailable && panelUserHidden);

    if (!panelAvailable) {
        projectPanel.classList.remove("is-floating");
        projectToggle.classList.remove("is-visible");
    }
}

function renderModalMedia(project) {
    modalMedia.innerHTML = "";

    if (project.media === "launch") {
        const launch = document.createElement("div");
        launch.className = "game-launch modal-launch";
        launch.innerHTML = `
            <span class="launch-moon"></span>
            <span class="launch-tree"></span>
            <span class="launch-character"></span>
            <div class="launch-copy">
                <p class="micro-text">Open playable build</p>
                <h3>${project.title}</h3>
                <p>GX Games does not allow embedded play, so use the launch buttons below to open the game.</p>
            </div>
        `;
        modalMedia.append(launch);
        return;
    }

    if (project.media === "image" && project.preview.startsWith("url(")) {
        const image = document.createElement("img");
        image.alt = project.title;
        image.src = project.preview.slice(5, -2);
        modalMedia.append(image);
        return;
    }

    const preview = document.createElement("div");
    preview.className = "modal-pastel-preview";
    preview.style.setProperty("--preview", project.preview);
    modalMedia.append(preview);
}

function openProjectModal(id) {
    const project = projects[id];
    if (!project) return;

    modalKicker.textContent = project.kicker;
    modalTitle.textContent = project.title;
    modalCopy.textContent = project.description;
    modalTags.innerHTML = tags(project);
    modalPrimary.href = project.primary;
    modalPrimary.textContent = project.primaryLabel || "Open";
    modalSecondary.href = project.secondary || project.primary;
    modalSecondary.textContent = project.secondaryLabel || "More";
    renderModalMedia(project);

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
        modal.querySelector(".modal-close").focus();
    });
}

function closeProjectModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    modalMedia.innerHTML = "";
}

document.querySelectorAll("[data-project]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        selectProject(trigger.dataset.project, true);
    });
});

openProjectButton.addEventListener("click", () => openProjectModal(currentProjectId));
panelPrev.addEventListener("click", () => moveProject(-1));
panelNext.addEventListener("click", () => moveProject(1));
panelClose.addEventListener("click", () => {
    panelUserHidden = true;
    projectPanel.classList.add("is-hidden");
    updateFloatingPanelState();
});
projectToggle.addEventListener("click", () => {
    panelUserHidden = false;
    projectPanel.classList.remove("is-hidden");
    updateFloatingPanelState();
});

document.querySelectorAll("[data-close-modal]").forEach((trigger) => {
    trigger.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
        closeProjectModal();
    }
});

menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
});

mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
    });
});

function addParticles() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 26; index += 1) {
        const dot = document.createElement("span");
        dot.className = "particle-dot";
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.animationDelay = `${Math.random() * 4}s`;
        dot.style.animationDuration = `${3.5 + Math.random() * 4}s`;
        fragment.append(dot);
    }
    document.body.append(fragment);
}

function addPointerGlow() {
    const scene = document.querySelector(".scene-section");
    let lastTrail = 0;

    scene.addEventListener("pointermove", (event) => {
        const rect = scene.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        scene.style.setProperty("--glow-x", `${x}%`);
        scene.style.setProperty("--glow-y", `${y}%`);

        const now = performance.now();
        if (now - lastTrail < 90 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        lastTrail = now;

        const spark = document.createElement("span");
        spark.className = "trail-spark";
        spark.style.left = `${event.clientX}px`;
        spark.style.top = `${event.clientY}px`;
        document.body.append(spark);
        window.setTimeout(() => spark.remove(), 820);
    });
}

function observeRails() {
    const sections = railLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            railLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { threshold: 0.42 });

    sections.forEach((section) => observer.observe(section));
}

window.addEventListener("scroll", updateFloatingPanelState, { passive: true });
window.addEventListener("resize", updateFloatingPanelState);
buildPanelDots();
selectProject("echoes");
addParticles();
addPointerGlow();
observeRails();
updateFloatingPanelState();
restartAutoSlide();
