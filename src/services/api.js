const BASE_URL = import.meta.env.VITE_API_URL || 'https://sui-rug-intel-backend.onrender.com'

export async function fetchNetworkStats() {
  const res = await fetch(`${BASE_URL}/api/network/stats`)
  return res.json()
}

export async function fetchAlerts() {
  const res = await fetch(`${BASE_URL}/api/alerts`)
  return res.json()
}

export async function fetchSearch(query) {
  const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
  return res.json()
}

export async function fetchTokenInfo(address) {
  const res = await fetch(`${BASE_URL}/api/tokens/${address}`)
  return res.json()
}

export async function fetchTokenAnalysis(address) {
  const res = await fetch(`${BASE_URL}/api/tokens/${address}/analyze`)
  return res.json()
}

export async function fetchWalletInfo(address) {
  const res = await fetch(`${BASE_URL}/api/wallets/${address}`)
  return res.json()
}
