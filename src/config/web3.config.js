import { configureChains, createConfig, sepolia } from 'wagmi';
import { mainnet, polygon, avalanche, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

export const RECEIVER_WALLET = '0xE68706DA0cd6F62599ee0A960098F1bcd02B124e' // Get from env or server

export const { chains, publicClient } = configureChains(
  [mainnet, polygon, avalanche, goerli, sepolia],
  [
    publicProvider()
  ]
);

export const { connectors } = getDefaultWallets({
  appName: 'SW Asset Store Demo',
  chains
});

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient
})
