import React, { useState, useEffect } from 'react';
import { Drawer, Group, ColorInput, Select, Accordion, Avatar, Button, Title, Tabs, Text, Slider } from '@mantine/core';
import { FaMicrophoneSlash, FaMicrophone, FaWalkieTalkie, FaHeart, FaShield, FaGasPump } from "react-icons/fa6";
import { TbLungsFilled } from 'react-icons/tb';
import { MdLocalDrink, MdRestaurant } from "react-icons/md";
import { PiEngineFill } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";

interface HUDSettingsProps {
  opened: boolean;
  onClose: () => void;
  colors: any;
  setColors: (colors: any) => void;
  position: string;
  setPosition: (position: string) => void;
  hudType: string;
  setHudType: (hudType: string) => void;
  vehicleType: string;
  setVehicleType: (vehicleType: string) => void;
}

const defaultColors = {
  voiceInactive: '#6c757d',
  voiceActive: '#ffd43b',
  voiceRadio: '#1c7ed6',
  health: '#51cf66',
  armor: '#74c0fc',
  oxygen: '#339af0',
  hunger: '#fcc419',
  thirst: '#22b8cf',
  stress: '#ff6b6b',
  engine: '#6c757d',
  fuel: '#6c757d',
};

const HUDSettings: React.FC<HUDSettingsProps> = ({ opened, onClose, colors, setColors, position, setPosition, hudType, setHudType, vehicleType, setVehicleType }) => {
  const [cinematicEnabled, setCinematicEnabled] = useState('disabled');

  useEffect(() => {
    fetchNui('getCinematicBarsState')
  }, []);

  const resetColors = () => {
    setColors(defaultColors);
    handleColorChange(defaultColors);
  };

  const handleColorChange = (updatedColors: any) => {
    setColors(updatedColors);
    fetchNui('updateColors', { colors: updatedColors })
  };

  const handleHudTypeChange = (value: string) => {
    setHudType(value || 'circle');
    fetchNui('updateHudType', { hudType: value || 'circle' })
};

const handlePositionChange = (value: string) => {
    setPosition(value || 'left');
    fetchNui('updateHudPosition', { hudPosition: value || 'left' })
};

  const handleClose = () => {
    fetchNui('hideHudMenu')
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Failed to hide HUD menu:', error);
        onClose();
      });
  };

  const handleCinematicToggle = (isEnabled: boolean) => {
    setCinematicEnabled(isEnabled ? 'enabled' : 'disabled');
    fetchNui('toggleCinematicBars', { enabled: isEnabled })
  };

  return (
    <Drawer opened={opened} onClose={handleClose} padding="xs" size="md" withCloseButton={false} data-autofocus>
      <Group position="left" mb="md">
        <Avatar color="blue" radius="sm">
          <IoSettingsOutline size="2rem" />
        </Avatar>
        <Title order={3}>HUD Settings</Title>
      </Group>

      <Tabs defaultValue="player">
        <Tabs.List grow>
          <Tabs.Tab value="player">Player</Tabs.Tab>
          <Tabs.Tab value="vehicle">Vehicle</Tabs.Tab>
          <Tabs.Tab value="voiceSettings">Voice</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="player" pt="xs">
          <Group spacing="sm">
          <Select
              label="HUD Type"
              placeholder="Select HUD Type"
              value={hudType}
              onChange={handleHudTypeChange}
              data={[
                { value: 'circle', label: 'Circle' },
                { value: 'rectangle', label: 'Rectangle' },
              ]}
              sx={{ width: '100%' }}
            />
            <Select
              label="HUD Position"
              placeholder="Pick a position"
              value={position}
              onChange={handlePositionChange}
              sx={{ width: '100%' }}
              data={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ]}
            />
              <Select
                label="Cinematic Bars"
                placeholder="Enable/Disable"
                value={cinematicEnabled}
                onChange={(value) => handleCinematicToggle(value === 'enabled')}
                data={[
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
                sx={{ width: '100%' }}
              />
            <Accordion chevronPosition="right" variant="contained" sx={{ width: '100%' }}>
              <Accordion.Item value="voiceInactive">
                <Accordion.Control><FaMicrophoneSlash /> Voice Inactive Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.voiceInactive || '#f1f3f5'}
                    onChange={(color) => handleColorChange({ ...colors, voiceInactive: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="voiceActive">
                <Accordion.Control><FaMicrophone /> Voice Active Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.voiceActive || '#ffec99'}
                    onChange={(color) => handleColorChange({ ...colors, voiceActive: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="voiceRadio">
                <Accordion.Control><FaWalkieTalkie /> Voice Radio Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.voiceRadio || '#339af0'}
                    onChange={(color) => handleColorChange({ ...colors, voiceRadio: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="health">
                <Accordion.Control><FaHeart /> Health Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.health || '#38d9a9'}
                    onChange={(color) => handleColorChange({ ...colors, health: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="armor">
                <Accordion.Control><FaShield /> Armor Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.armor || '#228be6'}
                    onChange={(color) => handleColorChange({ ...colors, armor: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="thirst">
                <Accordion.Control><MdLocalDrink /> Thirst Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.thirst || '#22b8cf'}
                    onChange={(color) => handleColorChange({ ...colors, thirst: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="hunger">
                <Accordion.Control><MdRestaurant /> Hunger Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.hunger || '#fff9db'}
                    onChange={(color) => handleColorChange({ ...colors, hunger: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="oxygen">
                <Accordion.Control><TbLungsFilled /> Oxygen Color</Accordion.Control>
                <Accordion.Panel>
                  <ColorInput
                    value={colors.oxygen || '#e3fafc'}
                    onChange={(color) => handleColorChange({ ...colors, oxygen: color })}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Button onClick={resetColors} fullWidth mt="md" variant="light">
              Reset to Default Colors
            </Button>
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value="vehicle" pt="xs">
          <Group spacing="sm">
            <Title order={4}>Vehicle Settings (More Coming Soon)</Title>
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value="voiceSettings" pt="xs">
        <Group spacing="sm">
          <Title order={4}>Voice Settings</Title>
          <Title order={4}>Voice Settings (More Coming Soon)</Title>
        </Group>
      </Tabs.Panel>
      </Tabs>
      <Text style={{marginTop: '12rem'}} ta="center" c="dimmed">THIS RESOURCE IS PROVIDED FOR FREE BY TS SCRIPTS</Text>
    </Drawer>
  );
};

export default HUDSettings;