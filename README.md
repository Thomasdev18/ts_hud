
# TS SCRIPTS - HUD

## Features

- Settings Menu
- Unique Design
- Multiple Hud Types
- Mantine V7
- QBOX / QBCORE (Maybe some changes are needed) / ESX SUPPORT (SOON)

## FAQ

### 1. How do I make this support other resolutions?
To ensure the UI displays correctly across different screen resolutions, force the UI resolution in FiveM settings to 1920x1080.

### 2. I use Qbox's Nitro system. How do I integrate it?
To integrate with Qbox's Nitro system, use the following code snippet:

```lua
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


## Screenshots

![App Screenshot](https://i.imgur.com/wG5Z5no.png)
![App Screenshot](https://i.imgur.com/V225TP3.png)

## License

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://www.gnu.org/licenses/gpl-3.0.html)


## Installation

You have two options for installation:

  1. **Use the Pre-Built Version:**  
   The pre-built version is ready to use and requires no additional setup—just plug and play!

  2. **Build from Source:**  
   If you prefer to build from the source code, follow these steps:

   ```bash
   cd web
   pnpm i
   pnpm build
   ```
After, ensure that the resource is correctly referenced in the server.cfg file.
## Support

[Join our Discord community](https://discord.gg/UBnX997H6A)


## Contributing

We welcome and encourage contributions from everyone!

If you have an idea for improvement, want to fix a bug, or add new features, feel free to make the changes and submit a Pull Request (PR). The TS Scripts team will review your PR as soon as possible.

Your contributions help us improve and grow—thank you for your support!
## Feedback

If you have any feedback, please reach out to me in our [Discord community](https://discord.gg/UBnX997H6A)


## Authors

- [@Thomasdev18](https://github.com/Thomasdev18)


## Credits
A big thank you to everyone who has contributed, reached out, and offered to help—I truly appreciate your support!

Special thanks to **MT-Scripts** for providing the foundation of the backend, which is based on their HUD.

- [@MT-Scripts](https://github.com/MT-Scripts)

