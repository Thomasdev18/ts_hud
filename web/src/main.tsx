import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'
import { VisibilityProvider } from './providers/VisibilityProvider'
import { MantineProvider } from '@mantine/core'
import Player from './components/Player'
import Vehicle from './components/Vehicle'
import { isEnvBrowser } from "./utils/misc";

if (isEnvBrowser()) {
  const root = document.getElementById("root");

  root!.style.backgroundImage = 'url("https://i.imgur.com/ZiJBeRi.png")';
  root!.style.backgroundSize = "contain";
  root!.style.backgroundRepeat = "no-repeat";
  root!.style.backgroundPosition = "center";
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'dark' }}>
       <VisibilityProvider componentName="Player">
        <Player />
      </VisibilityProvider>
   <VisibilityProvider componentName="Vehicle">
        <Vehicle />
       </VisibilityProvider>
    </MantineProvider>
  </React.StrictMode>
)