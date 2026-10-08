
-- ICESPY MENU v1.0.0
-- FiveM Client Controller

local menuOpen = false

-- Open or close ICESPY
local function ToggleMenu()
    menuOpen = not menuOpen

    SetNuiFocus(menuOpen, menuOpen)

    SendNUIMessage({
        action = "toggleMenu",
        show = menuOpen
    })

    print("[ICESPY] Menu " ..
        (menuOpen and "opened" or "closed"))
end

-- Register menu command
RegisterCommand("icespy", function()
    ToggleMenu()
end, false)

-- Open menu with F5
RegisterKeyMapping(
    "icespy",
    "Open ICESPY Menu",
    "keyboard",
    "F5"
)

-- Handle close button and Escape key
RegisterNUICallback("closeMenu", function(data, cb)
    menuOpen = false

    SetNuiFocus(false, false)

    SendNUIMessage({
        action = "toggleMenu",
        show = false
    })

    cb({ success = true })
end)

-- Cleanup when resource stops
AddEventHandler("onResourceStop", function(resource)
    if resource == GetCurrentResourceName() then
        SetNuiFocus(false, false)
    end
end)

print("[ICESPY] Client initialized successfully!")
