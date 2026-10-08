
/* ==========================================
   ICESPY MENU - JavaScript Controller
   Version: 1.1.0
   Theme: Blue & Black
   ========================================== */

// MENU ELEMENTS
const menu = document.getElementById("menu");
const navButtons = document.querySelectorAll(".nav-btn");
const tabs = document.querySelectorAll(".tab");
const pageTitle = document.getElementById("page-title");
const closeButton = document.getElementById("close-btn");

// Detect FiveM NUI environment
const isFiveM = typeof GetParentResourceName === "function";

// ==========================================
// TAB CONTROLLER
// ==========================================

function switchTab(tabName) {
    const selectedTab = document.getElementById(tabName);

    if (!selectedTab || !selectedTab.classList.contains("tab")) {
        console.warn("[ICESPY] Invalid tab:", tabName);
        return;
    }

    navButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.tab === tabName
        );
    });

    tabs.forEach((tab) => {
        tab.classList.toggle(
            "active",
            tab.id === tabName
        );
    });

    pageTitle.textContent =
        tabName.charAt(0).toUpperCase() + tabName.slice(1);

    console.log("[ICESPY] Switched to:", tabName);
}

// Register navigation buttons
navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        switchTab(button.dataset.tab);
    });
});

// ==========================================
// MENU VISIBILITY
// ==========================================

function openMenu() {
    menu.classList.remove("hidden");
    console.log("[ICESPY] Menu opened");
}

function hideMenu() {
    menu.classList.add("hidden");
    console.log("[ICESPY] Menu hidden");
}

function toggleMenu(show) {
    if (typeof show === "boolean") {
        menu.classList.toggle("hidden", !show);
    } else {
        menu.classList.toggle("hidden");
    }
}

// ==========================================
// CLOSE MENU
// ==========================================

function closeMenu() {
    hideMenu();

    if (isFiveM) {
        fetch(`https://${GetParentResourceName()}/closeMenu`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).catch((error) => {
            console.error("[ICESPY] Close error:", error);
        });
    }
}

// Close button
closeButton.addEventListener("click", closeMenu);

// Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// ==========================================
// DUI / NUI MESSAGE CONTROLLER
// ==========================================

window.addEventListener("message", (event) => {
    // Accept messages from this page or the embedding host.
    // This controller only performs local UI actions.
    if (
        event.source !== window &&
        event.source !== null
    ) {
        return;
    }

    let data = event.data;

    // Support JSON strings and JavaScript objects
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            return;
        }
    }

    if (!data || typeof data !== "object") {
        return;
    }

    switch (data.action) {

        case "toggleMenu":
            toggleMenu(data.show);
            break;

        case "openMenu":
            openMenu();
            break;

        case "hideMenu":
            hideMenu();
            break;

        case "closeMenu":
            closeMenu();
            break;

        case "switchTab":
            if (typeof data.tab === "string") {
                switchTab(data.tab);
            }
            break;

        default:
            // Ignore unrelated messages.
            break;
    }
});

// ==========================================
// BROWSER PREVIEW MODE
// ==========================================

if (!isFiveM) {
    openMenu();
    console.log("[ICESPY] Browser preview mode enabled");
} else {
    hideMenu();
    console.log("[ICESPY] FiveM NUI mode detected");
}

// ==========================================
// INITIALIZATION
// ==========================================

console.log("================================");
console.log("       ICESPY MENU v1.1         ");
console.log("       UI Initialized           ");
console.log("================================");


/* ICESPY v1.2.0 - LIVE CLOCK */

function updateIcespyClock() {
    const clock = document.getElementById("live-clock");

    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString("en-GB", {
        hour12: false
    });
}

updateIcespyClock();


/* ICESPY v1.2 - APPEARANCE CONTROLS */

const glowSlider = document.getElementById("glow-slider");
const opacitySlider = document.getElementById("opacity-slider");
const animationToggle = document.getElementById("animation-toggle");
const resetThemeButton = document.getElementById("reset-theme");

const defaultTheme = {
    glow: 50,
    opacity: 85,
    animated: true
};

function applyTheme(settings) {
    const glow = Math.max(0, Math.min(100, Number(settings.glow)));
    const opacity = Math.max(30, Math.min(100, Number(settings.opacity)));

    glowSlider.value = glow;
    opacitySlider.value = opacity;
    animationToggle.checked = settings.animated;

    document.getElementById("glow-value").textContent = glow + "%";
    document.getElementById("opacity-value").textContent = opacity + "%";

    menu.style.background = `rgba(11, 15, 25, ${opacity / 100})`;

    menu.style.setProperty(
        "--glow-strength",
        glow / 100
    );

    menu.classList.toggle("no-animation", !settings.animated);
}

function saveTheme() {
    const settings = {
        glow: Number(glowSlider.value),
        opacity: Number(opacitySlider.value),
        animated: animationToggle.checked
    };

    applyTheme(settings);

    try {
        localStorage.setItem("icespy-theme", JSON.stringify(settings));
    } catch (error) {
        console.warn("[ICESPY] Theme could not be saved:", error);
    }
}

glowSlider.addEventListener("input", saveTheme);
opacitySlider.addEventListener("input", saveTheme);
animationToggle.addEventListener("change", saveTheme);

resetThemeButton.addEventListener("click", () => {
    applyTheme(defaultTheme);
    saveTheme();
});

let savedTheme = defaultTheme;

try {
    const stored = JSON.parse(localStorage.getItem("icespy-theme"));
    if (stored && typeof stored === "object") {
        savedTheme = { ...defaultTheme, ...stored };
    }
} catch (error) {
    console.warn("[ICESPY] Using default appearance.");
}

applyTheme(savedTheme);


setInterval(updateIcespyClock, 1000);

