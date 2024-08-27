-- Last Modified: 25/08/2024

-- Global Constants and Configuration
local Config = lib.load('config')
local PlayerVoiceMethod, showingVehicleHUD, showingPlayerHUD, showingCompass = false, false, false, false
local isSeatbeltOn, isHarnessOn, nitroActive, nos, stress = false, false, false, false, 0
local speedMultiplier = Config.speedType == "MPH" and 2.23694 or 3.6
local camHeight = 0.0
local CAM_HEIGHT = 0.2  -- Screen height percentage for cinematic bars

local currentColors = {
    voiceInactive = '#6c757d', voiceActive = '#ffd43b', voiceRadio = '#1c7ed6',
    health = '#51cf66', armor = '#74c0fc', oxygen = '#339af0',
    hunger = '#fcc419', thirst = '#22b8cf', stress = '#ff6b6b',
}

-- Utility Functions
local function ShowNUI(action, shouldShow, focus)
    SetNuiFocus(focus, focus)
    SendNUIMessage({ action = action, data = shouldShow })
end

local function SendNUI(action, data)
    SendNUIMessage({ action = action, data = data })
end

local function settingsMenu()
    ShowNUI('HUDSettings', true, true)
end

local function hideSettingsMenu()
    ShowNUI('HUDSettings', false, false)
    SetNuiFocus(false, false)
end

local function getPlayerVoiceMethod(player)
    if PlayerVoiceMethod ~= "radio" then
        PlayerVoiceMethod = MumbleIsPlayerTalking(player) and "voice" or false
    end
    return PlayerVoiceMethod
end

local function getHeadingText(heading)
    if heading < 30 or heading >= 330 then
        return 'N'
    elseif heading < 60 then
        return 'NW'
    elseif heading < 120 then
        return 'W'
    elseif heading < 160 then
        return 'SW'
    elseif heading < 210 then
        return 'S'
    elseif heading < 240 then
        return 'SE'
    elseif heading < 310 then
        return 'E'
    else
        return 'NE'
    end
end

local lastCrossroadUpdate = 0
local lastCrossroadCheck = {}

local function getCrossroads(vehicle)
    local updateTick = GetGameTimer()
    if updateTick - lastCrossroadUpdate > 1500 then
        local pos = GetEntityCoords(vehicle)
        local street1, street2 = GetStreetNameAtCoord(pos.x, pos.y, pos.z)
        lastCrossroadUpdate = updateTick
        lastCrossroadCheck = { GetStreetNameFromHashKey(street1), GetStreetNameFromHashKey(street2) }
    end
    return lastCrossroadCheck
end

local function getFuelLevel(vehicle)
    return GetVehicleFuelLevel(vehicle)
end

local function getSeatbeltStatus()
    return isSeatbeltOn
end

local function getBlurIntensity(stressLevel)
    for _, v in pairs(Config.stress.blurIntensity) do
        if stressLevel >= v.min and stressLevel <= v.max then
            return v.intensity
        end
    end
    return 1500
end

local function getEffectInterval(stressLevel)
    for _, v in pairs(Config.stress.effectInterval) do
        if stressLevel >= v.min and stressLevel <= v.max then
            return v.timeout
        end
    end
    return 60000
end

local function isWhitelistedWeaponStress(weapon)
    if weapon then
        for _, v in pairs(Config.stress.whitelistedWeapons) do
            if weapon == v then
                return true
            end
        end
    end
    return false
end

local function startWeaponStressThread(weapon)
    if isWhitelistedWeaponStress(weapon) then return end
    hasWeapon = true

    CreateThread(function()
        while hasWeapon do
            if IsPedShooting(cache.ped) then
                if math.random() <= Config.stress.chance then
                    TriggerServerEvent('hud:server:GainStress', math.random(1, 5))
                end
            end
            Wait(0)
        end
    end)
end

AddEventHandler('ox_inventory:currentWeapon', function(currentWeapon)
    hasWeapon = false
    Wait(0)

    if not currentWeapon then return end

    startWeaponStressThread(currentWeapon.hash)
end)

local function saveHUDSettings()
    SetResourceKvp('playerHUDColors', json.encode(currentColors))
    SetResourceKvp('hudType', hudType)
    SetResourceKvp('hudPosition', position)
end

-- Example on how to save when settings are updated
RegisterNUICallback('updateHudType', function(data, cb)
    hudType = data.hudType
    saveHUDSettings() -- Save the updated HUD type
    cb({ status = 'success', message = 'HUD type updated to ' .. data.hudType })
end)

RegisterNUICallback('updateHudPosition', function(data, cb)
    position = data.hudPosition
    saveHUDSettings()
    cb({ status = 'success', message = 'HUD position updated to ' .. data.hudPosition })
end)

RegisterNUICallback('updateColors', function(data, cb)
    currentColors = data.colors
    saveHUDSettings()
    cb({ status = 'success', message = 'Colors updated' })
end)

-- Event Handlers
RegisterNetEvent('ts_hud:client:OpenHudMenu', settingsMenu)

RegisterNetEvent('ts_hud:client:hideHUD', function()
    ShowNUI('setVisiblePlayer', false, false)
    local vehicle = GetVehiclePedIsIn(cache.ped, false)
    if IsPedInVehicle(cache.ped, vehicle) and GetIsVehicleEngineRunning(vehicle) then
        ShowNUI('setVisibleVehicle', false, false)
    end
end)

RegisterNetEvent('ts_hud:client:showHud', function()
    ShowNUI('setVisiblePlayer', true, false)
    local vehicle = GetVehiclePedIsIn(cache.ped, false)
    if IsPedInVehicle(cache.ped, vehicle) and GetIsVehicleEngineRunning(vehicle) then
        ShowNUI('setVisibleVehicle', true, false)
    end
end)

RegisterNUICallback('hideHudMenu', function(_, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

local function setupHealthArmour(minimap, barType)
    BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
    ScaleformMovieMethodAddParamInt(barType)
    EndScaleformMovieMethod()
end

local function handleCinematicAnim()
    camMoving = true

    setupHealthArmour(camActive and 3 or 0)

    local step = camActive and 0.01 or -0.01
    for i = 0, CAM_HEIGHT, step do
        camHeight = i
        Wait(10)
    end

    camMoving = false
end

if GetResourceState('qbx_nitro') == 'started' then
    qbx.entityStateHandler('nitroFlames', function(veh, netId, value)
        local plate = qbx.string.trim(GetVehicleNumberPlateText(veh))
        local cachePlate = qbx.string.trim(GetVehicleNumberPlateText(cache.vehicle))
        if plate ~= cachePlate then return end
        nitroActive = value
    end)
    
    qbx.entityStateHandler('nitro', function(veh, netId, value)
        local plate = qbx.string.trim(GetVehicleNumberPlateText(veh))
        local cachePlate = qbx.string.trim(GetVehicleNumberPlateText(cache.vehicle))
        if plate ~= cachePlate then return end
        nos = value
    end)
end

CreateThread(function()
    local wasPauseMenuActive = IsPauseMenuActive()
    while true do
        if IsPauseMenuActive() then
            if not wasPauseMenuActive then
                wasPauseMenuActive = true
                if camActive then
                    camActive = false
                    DisplayRadar(not camActive)
                    DrawRect(0.0, 0.0, 2.0, camHeight, 0, 0, 0, 0)
                end
            end
        else
            if wasPauseMenuActive then
                wasPauseMenuActive = false
            end
            if camActive then
                DisplayRadar(not camActive)
                for i = 0, 1.0, 1.0 do
                    DrawRect(0.0, 0.0, 2.0, camHeight, 0, 0, 0, 255)
                    DrawRect(0.0, i, 2.0, camHeight, 0, 0, 0, 255)
                end
            end
        end
        Wait(0)
    end
end)

RegisterNUICallback('toggleCinematicBars', function(data, cb)
    camActive = data.enabled
    CreateThread(handleCinematicAnim)

    -- Hide the HUD elements when cinematic bars are enabled
    TriggerEvent('ts_hud:client:hideHUD')

    -- If cinematic bars are disabled, show the HUD elements again
    if not camActive then
        TriggerEvent('ts_hud:client:showHud')
    end

    -- Close HUD settings
    hideSettingsMenu()

    -- Notify the NUI that the operation was successful
    cb({ status = 'success', message = 'Cinematic bars ' .. (data.enabled and 'disabled') })
end)

RegisterNUICallback('getCinematicBarsState', function(_, cb)
    cb({ enabled = camActive })
end)

RegisterNetEvent('hud:client:LoadMap', function()
    Wait(50)
    local resolutionX, resolutionY = GetActiveScreenResolution()
    local minimapOffset = (1920 / 1080 > resolutionX / resolutionY) and ((1920 / 1080 - resolutionX / resolutionY) / 3.6) - 0.008 or 0

    RequestStreamedTextureDict("squaremap", false)
    while not HasStreamedTextureDictLoaded("squaremap") do
        Wait(150)
    end

    SetMinimapClipType(0)
    AddReplaceTexture("platform:/textures/graphics", "radarmasksm", "squaremap", "radarmasksm")
    AddReplaceTexture("platform:/textures/graphics", "radarmask1g", "squaremap", "radarmasksm")

    SetMinimapComponentPosition("minimap", "L", "B", -0.006 + minimapOffset, -0.040, 0.1638, 0.183)
    SetMinimapComponentPosition("minimap_mask", "L", "B", 0.0 + minimapOffset, 0.0, 0.128, 0.20)
    SetMinimapComponentPosition('minimap_blur', 'L', 'B', -0.015 + minimapOffset, 0.030, 0.262, 0.300)
    SetBlipAlpha(GetNorthRadarBlip(), 0)
    SetRadarBigmapEnabled(true, false)
    Wait(50)
    SetRadarBigmapEnabled(false, false)
    SetRadarZoom(1000)
end)

RegisterNetEvent('seatbelt:client:ToggleSeatbelt', function()
    isSeatbeltOn = not isSeatbeltOn
end)

RegisterNetEvent('hud:client:UpdateNitrous', function(_, nitroLevel, bool)
    nos = nitroLevel
    nitroActive = bool
end)

AddStateBagChangeHandler('stress', ('player:%s'):format(cache.serverId), function(_, _, value)
    stress = value
end)

AddEventHandler("pma-voice:radioActive", function(radioTalking)
    PlayerVoiceMethod = radioTalking and 'radio' or false
end)

RegisterNUICallback('updateHudType', function(data, cb)
    cb({ status = 'success', message = 'HUD type updated to ' .. data.hudType })
end)

-- Stress Management
if Config.stress.enableStress then
    CreateThread(function()
        while true do
            if LocalPlayer.state.isLoggedIn and cache.vehicle then
                local vehClass = GetVehicleClass(cache.vehicle)
                local speed = GetEntitySpeed(cache.vehicle) * speedMultiplier

                if vehClass ~= 13 and vehClass ~= 14 and vehClass ~= 15 and vehClass ~= 16 and vehClass ~= 21 then
                    local stressSpeed = (vehClass == 8 or not isSeatbeltOn) and Config.stress.minForSpeedingUnbuckled or Config.stress.minForSpeeding
                    if speed >= stressSpeed then
                        TriggerServerEvent('hud:server:GainStress', math.random(1, 3))
                    end
                end
            end
            Wait(10000)
        end
    end)
end

CreateThread(function()
    while true do
        local effectInterval = getEffectInterval(stress)
        if stress >= 100 then
            local blurIntensity = getBlurIntensity(stress)
            local fallRepeat = math.random(2, 4)
            local ragdollTimeout = fallRepeat * 1750
            TriggerScreenblurFadeIn(1000.0)
            Wait(blurIntensity)
            TriggerScreenblurFadeOut(1000.0)

            if not IsPedRagdoll(cache.ped) and IsPedOnFoot(cache.ped) and not IsPedSwimming(cache.ped) then
                local forwardVector = GetEntityForwardVector(cache.ped)
                SetPedToRagdollWithFall(cache.ped, ragdollTimeout, ragdollTimeout, 1, forwardVector.x, forwardVector.y, forwardVector.z, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0)
            end

            Wait(1000)
            for _ = 1, fallRepeat, 1 do
                Wait(750)
                DoScreenFadeOut(200)
                Wait(1000)
                DoScreenFadeIn(200)
                TriggerScreenblurFadeIn(1000.0)
                Wait(blurIntensity)
                TriggerScreenblurFadeOut(1000.0)
            end
        elseif stress >= Config.stress.minForShaking then
            local blurIntensity = getBlurIntensity(stress)
            TriggerScreenblurFadeIn(1000.0)
            Wait(blurIntensity)
            TriggerScreenblurFadeOut(1000.0)
        end
        Wait(effectInterval)
    end
end)

-- Fuel and Seatbelt Threads
CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn and cache.vehicle and not IsThisModelABicycle(GetEntityModel(cache.vehicle)) then
            if getFuelLevel(cache.vehicle) <= 20 and Config.isLowFuelChecked then
                lib.notify({
                    description = 'Vehicle is low on fuel!',
                    type = 'error',
                })
                Wait(60000)
            end
        end
        Wait(10000)
    end
end)

-- Main HUD Thread
CreateThread(function()
    -- Load saved colors, HUD type, and position from KVP
    local savedColors = GetResourceKvpString('playerHUDColors')
    if savedColors then
        currentColors = json.decode(savedColors)
    end

    local savedHudType = GetResourceKvpString('hudType')
    if savedHudType then
        hudType = savedHudType
    else
        hudType = Config.hudSettings.hudType  -- Default to config if not set
    end

    local savedHudPosition = GetResourceKvpString('hudPosition')
    if savedHudPosition then
        position = savedHudPosition
    else
        position = Config.hudSettings.hudPosition  -- Default to config if not set
    end

    while true do
        if not IsPauseMenuActive() and LocalPlayer.state.isLoggedIn then
            local stamina = 100 - GetPlayerSprintStaminaRemaining(cache.playerId)
            local PlayerData = Config.core.Functions.GetPlayerData()

            if not showingPlayerHUD then
                DisplayRadar(false)
                ShowNUI('setVisiblePlayer', true, false)
                showingPlayerHUD = true
            end

            if IsEntityInWater(cache.ped) then
                stamina = (GetPlayerUnderwaterTimeRemaining(cache.playerId) * 10) - 300
            end

            -- Send the updated HUD data to the NUI (including colors, HUD type, and position)
            SendNUI('player', {
                health = math.ceil(GetEntityHealth(cache.ped) - 100),
                stress = stress,
                armor = math.ceil(GetPedArmour(cache.ped)),
                thirst = math.ceil(PlayerData.metadata.thirst),
                hunger = math.ceil(PlayerData.metadata.hunger),
                oxygen = stamina or 0,
                voice = LocalPlayer.state.proximity.distance,
                talking = getPlayerVoiceMethod(cache.playerId),
                colors = currentColors,
                hudType = hudType,  -- Include HUD type
                hudPosition = position  -- Include HUD position
            })

            if cache.vehicle and GetIsVehicleEngineRunning(cache.vehicle) then
                DisplayRadar(true)
                if not showingVehicleHUD then
                    ShowNUI('setVisibleVehicle', true, false)
                    TriggerEvent('hud:client:LoadMap')
                    showingVehicleHUD = true
                end

                SendNUI('vehicle', {
                    speed = math.ceil(GetEntitySpeed(cache.vehicle) * speedMultiplier),
                    gear = GetVehicleCurrentGear(cache.vehicle),
                    speedType = Config.speedType,
                    seatbeltOn = getSeatbeltStatus(),
                    streetName1 = getCrossroads(cache.vehicle)[1],
                    streetName2 = getCrossroads(cache.vehicle)[2],
                    heading = getHeadingText(GetEntityHeading(cache.vehicle)),
                    engine = math.ceil(GetVehicleEngineHealth(cache.vehicle) / 10),
                    fuel = math.ceil(GetVehicleFuelLevel(cache.vehicle)),
                    nitrous = nos,
                    isInVehicle = true,
                })
                Wait(300)
            else
                if showingVehicleHUD then
                    DisplayRadar(false)
                    ShowNUI('setVisibleVehicle', false, false)
                    showingVehicleHUD = false
                end
                Wait(300)
            end
        else
            if showingPlayerHUD then
                ShowNUI('setVisiblePlayer', false, false)
                ShowNUI('setVisibleVehicle', false, false)
                showingVehicleHUD = false
                showingPlayerHUD = false
            end
            Wait(500)
        end
    end
end)

-- Keybind Registration
lib.addKeybind({
    name = 'openhud',
    description = 'Opens HUD Settings',
    defaultKey = Config.hudKeybind,
    defaultMapper = 'keyboard',
    onPressed = settingsMenu,
})
