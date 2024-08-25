local resetStress = false
local Config = lib.load('config')

AddEventHandler('ox_inventory:openedInventory', function(source)
    TriggerClientEvent('ts_hud:client:hideHUD', source)
end)

AddEventHandler('ox_inventory:closedInventory', function(source)
    TriggerClientEvent('ts_hud:client:showHud', source)
end)

RegisterNetEvent('hud:server:GainStress', function(amount)
    if not Config.stress.enableStress then return end

    local src = source
    local player = Config.core.Functions.GetPlayer(src)
    local newStress
    if not player then return end
    if not resetStress then
        if not player.PlayerData.metadata.stress then
            player.PlayerData.metadata.stress = 0
        end
        newStress = player.PlayerData.metadata.stress + amount
        if newStress <= 0 then newStress = 0 end
    else
        newStress = 0
    end
    if newStress > 100 then
        newStress = 100
    end
    player.Functions.SetMetaData('stress', newStress)
    TriggerClientEvent('hud:client:UpdateStress', src, newStress)
    TriggerClientEvent('ox_lib:notify', src, {
        description = 'Feeling More Stressed!',
        type = 'error',
    })
end)

RegisterNetEvent('hud:server:RelieveStress', function(amount)
    if not Config.stress.enableStress then return end

    local src = source
    local player = Config.core.Functions.GetPlayer(src)
    local newStress
    if not player then return end
    if not resetStress then
        if not player.PlayerData.metadata.stress then
            player.PlayerData.metadata.stress = 0
        end
        newStress = player.PlayerData.metadata.stress - amount
        if newStress <= 0 then newStress = 0 end
    else
        newStress = 0
    end
    if newStress > 100 then
        newStress = 100
    end
    player.Functions.SetMetaData('stress', newStress)
    TriggerClientEvent('hud:client:UpdateStress', src, newStress)
    TriggerClientEvent('ox_lib:notify', src, {
        description = 'Feeling Less Stressed!',
        type = 'success',
    })
end)