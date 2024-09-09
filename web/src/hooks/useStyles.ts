import { createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
    wrapperPlayer: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        backgroundSize: 'cover',
        display: 'flex',
        zIndex: 2,
    },
    wrapperVehicle: {
        width: '100%',
        height: '100%',
        position: 'fixed',
    },
    wrapperCompass: {
        width: '100%',
        height: '100%',
        position: 'fixed',
    },
    wrapperMenu: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    minimapContainer: {
        position: 'absolute',
        bottom: '5.5vh',
        left: '0.75vw',
        width: '16.6vw',
        height: '18.5vh',
        backgroundColor: "none",
        border: `2px solid ${theme.colors.dark[4]}`,
        padding: '2px',
        boxSizing: 'border-box',
        borderRadius: theme.radius.sm,
    },
    minimap: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    heading: {
        position: 'absolute',
        top: 2,
        right: 5,
        color: theme.colors.gray[4],
        fontWeight: 700,
        fontSize: '1.35vh',
    },
    streetNames: {
        position: 'absolute',
        top: 2,
        left: 5,
        textAlign: 'right',
    },
    streetName1: {
        color: theme.colors.gray[4],
        fontWeight: 700,
        textAlign: 'left',
        fontSize: '1.35vh',
        textTransform: 'uppercase',
    },
    streetName2: {
        color: theme.colors.gray[4],
        fontWeight: 500,
        fontSize: '1.20vh',
        textTransform: 'uppercase',
        marginTop: -2,
    },
    horizontalBar: {
        position: 'absolute',
        top: '-40px', // Move the bar further up on the screen
        right: -1,
        width: '100%',
        height: '0.75vh',
        margin: '12px 0', // Increase margin between bars
        backgroundColor: theme.colors.dark[5],
        border: `2px solid ${theme.colors.dark[4]}`,
        borderRadius: theme.radius.sm,
        zIndex: 3, // Ensure it's on top
    },
    fuelBar: {
        height: '100%',
        backgroundColor: theme.colors.gray[4],
        borderRadius: theme.radius.sm,
    },
    fuelBarOn: {
        height: '100%',
        backgroundColor: theme.colors.red[6],
        borderRadius: theme.radius.sm,
    },
    nitrousBar: {
        height: '100%',
        backgroundColor: theme.colors.violet[3],
        borderRadius: theme.radius.sm,
    },
    speed: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        fontWeight: 700,
        fontSize: '1.85vh',
        color: theme.colors.gray[4],
    },
    gear: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        fontWeight: 700,
        color: theme.colors.gray[4],
        fontSize: '1.85vh',
    },
    iconGroup: {
        position: 'absolute',
        bottom: '3vh', // Position the icons above the speed
        right: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px', // Small gap between the icons
    },
    seatbeltIcon: {
        color: theme.colors.red[6], // Default red color for seatbelt off
        fontSize: '24px',
    },
    seatbeltIconOn: {
        color: theme.colors.green[6], // Green color for seatbelt on
        fontSize: '24px',
    },
    engineIcon: {
        color: theme.colors.red[6], // Red color for engine warning
        fontSize: '24px',
    },
}));

export default useStyles;
