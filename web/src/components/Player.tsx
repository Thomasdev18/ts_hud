import React, { useState, useEffect } from "react";
import { Group, ThemeIcon, Box, Center, RingProgress, DEFAULT_THEME } from '@mantine/core';
import { TbLungsFilled } from 'react-icons/tb';
import { FaHeart, FaWalkieTalkie, FaSkull, FaMicrophone, FaShield, FaBrain } from "react-icons/fa6";
import { FaMicrophoneSlash } from 'react-icons/fa';
import { MdLocalDrink, MdRestaurant } from "react-icons/md";
import HUDSettings from './HUDSettings';
import useStyles from '../hooks/useStyles';
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";

const Player: React.FC = () => {
    const { classes } = useStyles();
    const theme = DEFAULT_THEME;
    const [health, setHealth] = useState<number>(40);
    const [armor, setArmor] = useState<number>(50);
    const [thirst, setThirst] = useState<number>(50);
    const [hunger, setHunger] = useState<number>(50);
    const [oxygen, setOxygen] = useState<number>(50);
    const [stress, setStress] = useState<number>(50);
    const [talking, setTalking] = useState<any>(false);
    const [voice, setVoice] = useState<number>(0);
    const [colors, setColors] = useState<any>({
        voiceInactive: '#6c757d',
        voiceActive: '#ffd43b',
        voiceRadio: '#1c7ed6',
        health: '#51cf66',
        armor: '#74c0fc',
        oxygen: '#339af0',
        hunger: '#fcc419',
        thirst: '#22b8cf',
        stress: '#ff6b6b',
    });
    const [position, setPosition] = useState<string>('left');
    const [hudType, setHudType] = useState<string>('rectangle');
    const [vehicleType, setVehicleType] = useState<string>('default');
    const [opened, setOpened] = useState(false);

    useNuiEvent<any>('player', (data) => {
        setColors(data.colors);
        setHealth(data.health);
        setArmor(data.armor);
        setThirst(data.thirst);
        setHunger(data.hunger);
        setOxygen(data.oxygen);
        setStress(data.stress);
        setTalking(data.talking);
        setVoice(data.voice);
        setHudType(data.hudType);
        setPosition(data.hudPosition);
    });

    useNuiEvent('HUDSettings', (data: boolean) => {
        setOpened(data);
    });

    useNuiEvent<any>('player', (data) => {
        if (data.hudType) {
            setHudType(data.hudType);
        }
        if (data.hudPosition) {
            setPosition(data.hudPosition);
        }
    });

    const getPositionStyle = () => {
        switch (position) {
            case 'center':
                return { left: '50%', transform: 'translateX(-50%)' };
            case 'right':
                return { right: 10 };
            default:
                return { left: 10 };
        }
    };

    const renderRectangleProgress = (value: number, progressColor: string, icon: React.ReactNode) => {
        return (
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.dark[6],
                    border: `3px solid ${theme.colors.dark[7]}`,
                    borderRadius: 10,
                    padding: '8px',
                    boxSizing: 'border-box',
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: progressColor,
                        borderRadius: 10,
                        clipPath: `inset(${100 - value}% 0 0 0)`,
                    }}
                />
                <ThemeIcon 
                    sx={{ 
                        color: '#f1f3f5',
                        backgroundColor: "transparent",
                        zIndex: 1, 
                    }} 
                    radius="xl" 
                    size={30}
                >
                    {icon}
                </ThemeIcon>
            </Box>
        );
    };

    const renderCircleProgress = (value: number, progressColor: string, icon: React.ReactNode) => {
        return (
            <Box
                sx={{
                    width: 45,
                    height: 45,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.colors.dark[6],
                    border: `3px solid ${theme.colors.dark[7]}`,
                    borderRadius: '50%',
                    padding: '5px',
                    position: 'relative',
                }}
            >
                <RingProgress
                    sections={[{ value: value, color: progressColor }]}
                    thickness={4}
                    size={45}
                    roundCaps
                    sx={{ position: 'absolute', bottom: '-3px', left: '-3px' }}
                    label={
                        <Center>
                            <ThemeIcon
                                color="transparent"
                                variant='light'
                                radius='xl'
                                size={30}
                            >
                                {icon}
                            </ThemeIcon>
                        </Center>
                    }
                />
            </Box>
        );
    };

    return (
        <div className={classes.wrapperPlayer}>
            <Group spacing={4} style={{ position: 'absolute', bottom: 5, ...getPositionStyle() }}>
                {hudType === 'rectangle' && renderRectangleProgress(voice === 1.5 ? 25 : voice === 3.0 ? 50 : 100, talking === 'radio' ? colors.voiceRadio : talking === 'voice' ? colors.voiceActive : colors.voiceInactive, !talking ? <FaMicrophoneSlash size={20} /> : talking === 'voice' ? <FaMicrophone size={20} /> : <FaWalkieTalkie size={20} />)}
                {hudType === 'circle' && renderCircleProgress(voice === 1.5 ? 25 : voice === 3.0 ? 50 : 100, talking === 'radio' ? colors.voiceRadio : talking === 'voice' ? colors.voiceActive : colors.voiceInactive, !talking ? <FaMicrophoneSlash size={18} /> : talking === 'voice' ? <FaMicrophone size={18} /> : <FaWalkieTalkie size={18} />)}

                {hudType === 'rectangle' && renderRectangleProgress(health, health <= 0 ? 'red' : colors.health, health > 0 ? <FaHeart size={20} /> : <FaSkull size={20} />)}
                {hudType === 'circle' && renderCircleProgress(health, health <= 0 ? 'red' : colors.health, health > 0 ? <FaHeart size={18} /> : <FaSkull size={18} />)}

                {armor > 0 && hudType === 'rectangle' && renderRectangleProgress(armor, colors.armor, <FaShield size={20} />)}
                {armor > 0 && hudType === 'circle' && renderCircleProgress(armor, colors.armor, <FaShield size={18} />)}

                {thirst < 100 && hudType === 'rectangle' && renderRectangleProgress(thirst, thirst <= 20 ? 'red' : colors.thirst, <MdLocalDrink size={20} />)}
                {thirst < 100 && hudType === 'circle' && renderCircleProgress(thirst, thirst <= 20 ? 'red' : colors.thirst, <MdLocalDrink size={18} />)}

                {hunger < 100 && hudType === 'rectangle' && renderRectangleProgress(hunger, hunger <= 20 ? 'red' : colors.hunger, <MdRestaurant size={20} />)}
                {hunger < 100 && hudType === 'circle' && renderCircleProgress(hunger, hunger <= 20 ? 'red' : colors.hunger, <MdRestaurant size={18} />)}

                {oxygen < 100 && hudType === 'rectangle' && renderRectangleProgress(oxygen, oxygen <= 20 ? 'red' : colors.oxygen, <TbLungsFilled size={20} />)}
                {oxygen < 100 && hudType === 'circle' && renderCircleProgress(oxygen, oxygen <= 20 ? 'red' : colors.oxygen, <TbLungsFilled size={18} />)}

                {stress > 0 && hudType === 'rectangle' && renderRectangleProgress(stress, colors.stress, <FaBrain size={20} />)}
                {stress > 0 && hudType === 'circle' && renderCircleProgress(stress, colors.stress, <FaBrain size={18} />)}
            </Group>

            <HUDSettings 
                opened={opened} 
                onClose={() => setOpened(false)} 
                colors={colors}
                setColors={setColors} 
                position={position}
                setPosition={setPosition}
                hudType={hudType}
                setHudType={setHudType}
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
            />
        </div>
    );
}

export default Player;