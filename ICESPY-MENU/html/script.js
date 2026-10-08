
/* ==========================================
   ICESPY MENU - JavaScript Controller
   Version: 1.2.0
   Theme: Blue & Black
   ========================================== */

// ==========================================
// MENU ELEMENTS
// ==========================================

const menu = document.getElementById("menu");
const navButtons = document.querySelectorAll(".nav-btn");
const tabs = document.querySelectorAll(".tab");
const pageTitle = document.getElementById("page-title");
const closeButton = document.getElementById("close-btn");

// Detect standard FiveM NUI environment.
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

closeButton.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.classList.contains("hidden")) {
        closeMenu();
    }
});

// ==========================================
// NUI / BROWSER MESSAGE CONTROLLER
// ==========================================

window.addEventListener("message", (event) => {
    // Only accept messages from this page or a host
    // that provides a null source.
    if (event.source !== window && event.source !== null) {
        return;
    }

    let data = event.data;

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
            break;
    }
});

// ==========================================
// LIVE CLOCK
// ==========================================

function updateIcespyClock() {
    const clock = document.getElementById("live-clock");

    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString("en-GB", {
        hour12: false
    });
}

updateIcespyClock();
setInterval(updateIcespyClock, 1000);

// ==========================================
// APPEARANCE ELEMENTS
// ==========================================

const glowSlider = document.getElementById("glow-slider");
const opacitySlider = document.getElementById("opacity-slider");
const animationToggle = document.getElementById("animation-toggle");
const resetThemeButton = document.getElementById("reset-theme");

const glowValue = document.getElementById("glow-value");
const opacityValue = document.getElementById("opacity-value");

// ==========================================
// DEFAULT THEME
// ==========================================

const defaultTheme = {
    glow: 50,
    opacity: 85,
    animated: true
};

const themeStorageKey = "icespy-theme";

// Keep all appearance settings in the range
// supported by the sliders.
function clamp(value, min, max, fallback) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.max(min, Math.min(max, number));
}

// ==========================================
// APPLY APPEARANCE SETTINGS
// ==========================================

function applyTheme(settings) {
    const glow = clamp(
        settings.glow,
        0,
        100,
        defaultTheme.glow
    );

    const opacity = clamp(
        settings.opacity,
        30,
        100,
        defaultTheme.opacity
    );

    const animated =
        typeof settings.animated === "boolean"
            ? settings.animated
            : defaultTheme.animated;

    // Update settings controls.
    glowSlider.value = glow;
    opacitySlider.value = opacity;
    animationToggle.checked = animated;

    // Update displayed percentages.
    glowValue.textContent = glow + "%";
    opacityValue.textContent = opacity + "%";

    // Update the CSS variables used in style.css.
    menu.style.setProperty(
        "--glow-strength",
        String(glow / 100)
    );

    menu.style.setProperty(
        "--menu-opacity",
        String(opacity / 100)
    );

    // Turn the border animation on or off.
    menu.classList.toggle("no-animation", !animated);

    console.log("[ICESPY] Appearance updated:", {
        glow,
        opacity,
        animated
    });
}

// ==========================================
// SAVE APPEARANCE SETTINGS
// ==========================================

function saveTheme() {
    const settings = {
        glow: Number(glowSlider.value),
        opacity: Number(opacitySlider.value),
        animated: animationToggle.checked
    };

    applyTheme(settings);

    try {
        localStorage.setItem(
            themeStorageKey,
            JSON.stringify(settings)
        );
    } catch (error) {
        console.warn(
            "[ICESPY] Could not save appearance:",
            error
        );
    }
}

// ==========================================
// LOAD SAVED SETTINGS
// ==========================================

function loadTheme() {
    try {
        const storedTheme = localStorage.getItem(
            themeStorageKey
        );

        if (!storedTheme) {
            return { ...defaultTheme };
        }

        const parsed = JSON.parse(storedTheme);

        if (
            !parsed ||
            typeof parsed !== "object" ||
            Array.isArray(parsed)
        ) {
            return { ...defaultTheme };
        }

        return {
            ...defaultTheme,
            ...parsed
        };
    } catch (error) {
        console.warn(
            "[ICESPY] Could not load saved appearance:",
            error
        );

        return { ...defaultTheme };
    }
}

// ==========================================
// SETTINGS EVENT LISTENERS
// ==========================================

if (
    glowSlider &&
    opacitySlider &&
    animationToggle &&
    resetThemeButton &&
    glowValue &&
    opacityValue
) {
    glowSlider.addEventListener("input", saveTheme);

    opacitySlider.addEventListener("input", saveTheme);

    animationToggle.addEventListener("change", saveTheme);

    resetThemeButton.addEventListener("click", () => {
        applyTheme(defaultTheme);
        saveTheme();

        console.log("[ICESPY] Appearance reset");
    });

    // Apply stored preferences on startup.
    applyTheme(loadTheme());
} else {
    console.warn(
        "[ICESPY] Appearance controls missing from index.html"
    );
}

// ==========================================
// BROWSER PREVIEW MODE
// ==========================================

if (!isFiveM) {
    openMenu();
    console.log("[ICESPY] Browser preview mode enabled");
} else {
    hideMenu();
    console.log("[ICESPY] Standard FiveM NUI mode detected");
}

// ==========================================
// INITIALIZATION
// ==========================================

console.log("================================");
console.log("       ICESPY MENU v1.2.0       ");
console.log("       UI Initialized           ");
console.log("================================");
