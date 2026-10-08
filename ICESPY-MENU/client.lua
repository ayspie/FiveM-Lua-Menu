
-- ==========================================
-- ICESPY MENU
-- FiveM Client Controller
-- Version: 1.1.0
-- ==========================================

local menuOpen = false

-- ==========================================
-- MENU VISIBILITY CONTROLLER
-- ==========================================

local function SetMenuVisible(visible)
    menuOpen = visible

    -- Set FiveM NUI focus
    SetNuiFocus(visible, visible)

    -- Update HTML menu visibility
    SendNUIMessage({
        action = "toggleMenu",
        show = visible
    })

    print("[ICESPY] Menu " ..
        (visible and "opened" or "closed"))
end

-- ==========================================
-- OPEN / CLOSE MENU
-- ==========================================

RegisterCommand("icespy", function()
    SetMenuVisible(not menuOpen)
end, false)

-- Open ICESPY using F5
RegisterKeyMapping(
    "icespy",
    "Open ICESPY Menu",
    "keyboard",
    "F5"
)

-- ==========================================
-- NUI CLOSE CALLBACK
-- ==========================================

RegisterNUICallback("closeMenu", function(data, cb)
    SetMenuVisible(false)

    cb({
        success = true
    })
end)

-- ==========================================
-- TAB SWITCHING CONTROLLER
-- ==========================================

local allowedTabs = {
    home = true,
    player = true,
    vehicle = true,
    settings = true
}

local function SwitchMenuTab(tabName)
    if type(tabName) ~= "string" then
        print("[ICESPY] Invalid tab name")
        return
    end

    tabName = tabName:lower()

    if not allowedTabs[tabName] then
        print("[ICESPY] Unknown tab: " .. tabName)
        return
    end

    -- Open menu if closed
    if not menuOpen then
        SetMenuVisible(true)
    end

    -- Send selected tab to HTML
    SendNUIMessage({
        action = "switchTab",
        tab = tabName
    })

    print("[ICESPY] Switched to tab: " .. tabName)
end

-- ==========================================
-- TAB COMMAND
-- ==========================================

RegisterCommand("icespytab", function(source, args)
    local tabName = args[1] or "home"

    SwitchMenuTab(tabName)
end, false)

-- ==========================================
-- RESOURCE CLEANUP
-- ==========================================

AddEventHandler("onResourceStop", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        menuOpen = false
        SetNuiFocus(false, false)
    end
end)

-- ==========================================
-- INITIALIZATION
-- ==========================================

print("================================")
print("       ICESPY MENU v1.1.0       ")
print("       Client Initialized       ")
print("================================")
