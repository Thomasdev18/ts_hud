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
    compass: {
        position: 'absolute',
        top: -7,
        width: '300px',
        height: '25px',
    },
    compass2: {
        position: 'absolute',
        top: 0,
        width: '300px',
        height: '50px',
        fontSize: '5pt',
    },
    compassArrow: {
        position: 'absolute',
        top: 0,
        width: '5px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: theme.radius.sm
    },
    minimapContainer: {
        position: 'absolute',
        bottom: 60,
        left: 14,
        width: '320px',
        height: '200px',
        backgroundColor: "none",
        border: `4px solid ${theme.colors.dark[7]}`,
        padding: '2px',
        boxSizing: 'border-box',
        borderRadius: theme.radius.sm,
      },
      minimap: {
        width: '100%',
        height: '100%',
      },
}))

export default useStyles