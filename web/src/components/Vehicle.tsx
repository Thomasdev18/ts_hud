import React, { useState } from "react";
import { Group, Text, DEFAULT_THEME, Box } from '@mantine/core';
import { useNuiEvent } from "../hooks/useNuiEvent";
import { PiSeatbeltFill, PiEngineFill } from "react-icons/pi"; // Import the seatbelt and engine icons
import { FaGasPump } from "react-icons/fa6"; // Import the fuel icon
import useStyles from '../hooks/useStyles';
import '../index.css';

const Vehicle: React.FC = () => {
  const { classes } = useStyles();
  const theme = DEFAULT_THEME;
  const [speed, setSpeed] = useState<number>(0);
  const [gear, setGear] = useState<number>(0);
  const [speedType, setSpeedType] = useState<string>('KMT');
  const [seatbeltOn, setSeatbeltOn] = useState<boolean>(false);
  const [streetName1, setStreetName1] = useState<string>('OSLO');
  const [streetName2, setStreetName2] = useState<string>('FROGNER'); // Second street name
  const [heading, setHeading] = useState<string>('N'); // Compass heading
  const [fuel, setFuel] = useState<number>(40); // Fuel level
  const [engineHealth, setEngineHealth] = useState<number>(0); // Engine health
  const [nitrous, setNitrous] = useState<number>(50); // Nitrous level
  const formattedSpeed = speed.toString().padStart(3, '0');
  const [isInVehicle, setIsInVehicle] = useState<boolean>(true);
  const [isHarnessOn, setHarnessOn] = useState<boolean>(false);

  useNuiEvent<any>('vehicle', (data) => {
    setSpeed(data.speed);
    setGear(data.gear);
    setSpeedType(data.speedType);
    setSeatbeltOn(data.seatbeltOn);
    setStreetName1(data.streetName1 || 'UNKNOWN'); // Default to UNKNOWN if not provided
    setStreetName2(data.streetName2 || 'UNKNOWN'); // Default to UNKNOWN if not provided
    setHeading(data.heading || 'N');
    setFuel(data.fuel || 100);
    setEngineHealth(data.engineHealth || 100);
    setNitrous(data.nitrous || 0);
    setIsInVehicle(data.isInVehicle);
    setHarnessOn(data.isHarnessOn);
});

  const renderHorizontalFuelIndicator = (value: number) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          margin: '4px 0',
        }}
      >
        {/* Gear Box */}
        <Box
          sx={{
            width: 40,
            height: 20,
            backgroundColor: theme.colors.dark[6],
            border: `3px solid ${theme.colors.dark[7]}`,
            borderRadius: theme.radius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 4,
          }}
        >
          <Text color="white" fw={700} size={14}>
            {gear === 0 ? 'R' : gear}
          </Text>
        </Box>

        {/* Fuel Icon Box */}
        <Box
          sx={{
            width: 40,
            height: 20,
            backgroundColor: theme.colors.dark[6],
            border: `3px solid ${theme.colors.dark[7]}`,
            borderRadius: theme.radius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 4,
          }}
        >
          <FaGasPump
            size={16}
            style={{
              color: '#f1f3f5',
            }}
          />
        </Box>

        {/* Fuel Bar */}
        <Box 
          sx={{ 
            flexGrow: 1,
            height: 20,
            backgroundColor: theme.colors.dark[6], 
            border: `3px solid ${theme.colors.dark[7]}`,
            borderRadius: theme.radius.sm,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: `${value}%`,
              height: '100%',
              backgroundColor: value <= 20 ? 'red' : theme.colors.gray[4],
              borderRadius: theme.radius.sm,
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderHorizontalNitrousIndicator = (value: number) => {
    if (value <= 0) return null;
    
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          margin: '1px 0',
        }}
      >
        {/* Nitrous Bar */}
        <Box 
          sx={{ 
            flexGrow: 1,
            height: 5,
            backgroundColor: theme.colors.dark[6], 
            border: `3px solid ${theme.colors.dark[7]}`,
            borderRadius: theme.radius.sm,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: `${value}%`,
              height: '100%',
              backgroundColor: value <= 20 ? 'red' : theme.colors.violet[3],
              borderRadius: theme.radius.sm,
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <div className={classes.wrapperVehicle}>
      <Group spacing={4} style={{ position: 'absolute', bottom: 60, left: 350, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        {/* Speed Display with SpeedType After */}
        <Group spacing={4} align="left">
          <Text color="white" size={80} fw={700} style={{ lineHeight: 1 }}>
            {formattedSpeed}
          </Text>
          <Text color={theme.colors.gray[4]} fw={700} size={30} style={{ marginLeft: 4, marginTop: '1.5rem' }}>
            {speedType.toUpperCase()}
          </Text>
        </Group>

        {/* Gear and Fuel Indicator */}
        {renderHorizontalFuelIndicator(fuel)}

        {renderHorizontalNitrousIndicator(nitrous)}

        {/* Street, Seatbelt, and Engine Health Display */}
        <Group spacing={4} style={{ marginTop: 0, border: `3px solid ${theme.colors.dark[7]}`, backgroundColor: theme.colors.dark[6], padding: '4px 8px', borderRadius: theme.radius.sm }}>
          {/* Heading Box */}
          <Box
            sx={{
              width: 50,
              height: 25,
              backgroundColor: theme.colors.gray[4],
              border: `3px solid ${theme.colors.gray[6]}`,
              borderRadius: theme.radius.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text color="gray" fw={700} size={14}>
              {heading}
            </Text>
          </Box>

          {/* Street Name */}
          <Text
            color="white"
            fw={700}
            size={13}
            style={{ 
              textTransform: 'uppercase',
              maxWidth: '118px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {streetName1} {streetName2 && `| ${streetName2}`}
          </Text>

          {/* Seatbelt and Harness Icons */}
          <Box
              sx={{
                  width: 50,
                  height: 25,
                  backgroundColor: isHarnessOn ? theme.colors.blue[6] : (seatbeltOn ? theme.colors.green[6] : theme.colors.red[6]),
                  border: `3px solid ${isHarnessOn ? theme.colors.blue[7] : (seatbeltOn ? theme.colors.green[7] : theme.colors.red[7])}`,
                  borderRadius: theme.radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
              }}
          >
              {isHarnessOn ? (
                  <PiSeatbeltFill  size={16} color="#f1f3f5" />
              ) : (
                  <PiSeatbeltFill size={16} color="#f1f3f5" />
              )}
          </Box>


          {/* Engine Icon Box */}
          {engineHealth <= 30 && (
            <Box
              sx={{
                width: 50,
                height: 25,
                backgroundColor: theme.colors.red[6],
                border: `3px solid ${theme.colors.red[7]}`,
                borderRadius: theme.radius.sm,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 5,
              }}
            >
              <PiEngineFill size={16} color="#f1f3f5" />
            </Box>
          )}
        </Group>
      </Group>

      {isInVehicle && (
          <Box className={classes.minimapContainer}>
              <Box className={classes.minimap}></Box>
          </Box>
      )}

    </div>
  );
}

export default Vehicle;
