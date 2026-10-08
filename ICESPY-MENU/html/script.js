
/* ICESPY MENU - JavaScript Controller */

const menu = document.getElementById("menu");
const navButtons = document.querySelectorAll(".nav-btn");
const tabs = document.querySelectorAll(".tab");
const pageTitle = document.getElementById("page-title");
const closeButton = document.getElementById("close-btn");

// Detect whether the UI is running inside FiveM
const isFiveM = typeof GetParentResourceName === "function";

// Switch menu tabs
function switchTab(tabName) {
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
}

// Register navigation buttons
navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        switchTab(button.dataset.tab);
    });
});

// Close menu
function closeMenu() {
    menu.classList.add("hidden");

    if (isFiveM) {
        fetch(`https://${GetParentResourceName()}/closeMenu`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).catch((error) => {
            console.error("Failed to close menu:", error);
        });
    }
}

// Close button
closeButton.addEventListener("click", closeMenu);

// Escape key closes the menu
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// Receive messages from FiveM Lua
window.addEventListener("message", (event) => {
    const data = event.data;

    if (data.action === "toggleMenu") {
        menu.classList.toggle("hidden", !data.show);
    }
});

// Browser preview mode
if (!isFiveM) {
    menu.classList.remove("hidden");
    console.log("ICESPY running in browser preview mode.");
}

console.log("ICESPY JavaScript initialized.");
