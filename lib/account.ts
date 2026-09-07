export type AssetType = "fiat" | "crypto"

export type Asset = {
  symbol: string
  name: string
  type: AssetType
  balance: number
  network?: string
  address?: string
}

export type Account = {
  id: string
  name: string
  email: string
  currency: string
  fiatBalance: number
  walletConnected: boolean
  assets: Asset[]
}

export const demoAccount: Account = {
  id: "NXR-USER-001",
  name: "NOLERA User",
  email: "user@nolera.x",
  currency: "USD",
  fiatBalance: 24680.5,
  walletConnected: false,

  assets: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      type: "crypto",
      balance: 0.125,
      network: "Bitcoin",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      type: "crypto",
      balance: 2.4,
      network: "Ethereum",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      type: "crypto",
      balance: 1500,
      network: "Ethereum",
    },
  ],
}

export function getTotalCryptoAssets() {
  return demoAccount.assets.reduce(
    (total, asset) => total + asset.balance,
    0
  )
}

export function connectWallet() {
  demoAccount.walletConnected = true
}

export function disconnectWallet() {
  demoAccount.walletConnected = false
}
