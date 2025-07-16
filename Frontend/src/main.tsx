import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { WalletProvider } from './components/Wallet'

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
