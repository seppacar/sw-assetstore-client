import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Styles for rainbowkit
import '@rainbow-me/rainbowkit/styles.css';
// Import web3 config
import { wagmiConfig, chains } from './config/web3.config';
// Rainbowkit  and Wagmi imports to use EVM compatible chains
import {  WagmiConfig } from 'wagmi';
import {  RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} modalSize="compact" theme={darkTheme()}>
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

