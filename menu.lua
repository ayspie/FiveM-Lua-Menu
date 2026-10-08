print("FiveM Lua Menu Loaded Successfully!")

local Menu = {}

Menu.Name = "My Lua Menu"
Menu.Version = "1.0.0"

function Menu.Initialize()
    print("Welcome to " .. Menu.Name)
end

Menu.Initialize()
