import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
// recharts removed - using DexScreener embed instead
import {
  ArrowLeft, AlertTriangle, Shield, Wallet,
  TrendingUp, Users, Activity, ExternalLink, Copy, Check
} from 'lucide-react'

const riskColor = (level) => {
  if (level === 'SAFE') return { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' }
  if (level === 'HIGH') return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)' }
  if (level === 'MEDIUM') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' }
  return { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)' }
}

function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-xl p-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
        border: '1px solid rgba(77,162,255,0.12)',
      }}
    >
      {children}
    </motion.div>
  )
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div>
      <p className="text-xs mb-1.5 uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>{label}</p>
      <div className="flex items-center gap-2">
        <code className="text-sm px-3 py-2 rounded-lg flex-1 truncate"
          style={{ background: 'rgba(77,162,255,0.06)', color: '#6FE3FF', border: '1px solid rgba(77,162,255,0.1)' }}>
          {value}
        </code>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCopy}
          className="p-2 rounded-lg transition-all duration-200"
          style={{
            background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(77,162,255,0.08)',
            border: copied ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(77,162,255,0.15)',
            color: copied ? '#4ade80' : '#4DA2FF',
          }}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => window.open(`https://suiscan.xyz/mainnet/coin/${value}`, '_blank')}
          className="p-2 rounded-lg transition-all duration-200"
          style={{ background: 'rgba(77,162,255,0.08)', border: '1px solid rgba(77,162,255,0.15)', color: '#4DA2FF' }}>
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

export default function TokenDetail() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const API = import.meta.env.VITE_API_URL || 'https://sui-rug-intel-backend.onrender.com'

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      fetch(`${API}/api/dex/tokens/${encodeURIComponent(symbol)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          const t = data.data
          const buyPressure = t.buys24h && t.sells24h
            ? Math.round((t.buys24h / (t.buys24h + t.sells24h)) * 100)
            : 50
          const riskScore = t.liquidityRaw < 10000 ? 78 : t.liquidityRaw < 50000 ? 45 : 20
          const riskLevel = t.liquidityRaw < 10000 ? 'HIGH' : t.liquidityRaw < 50000 ? 'MEDIUM' : 'SAFE'
          setToken({
            name: t.name,
            symbol: t.symbol,
            price: t.price,
            change: t.change24h,
            positive: t.positive,
            marketCap: t.marketCap,
            fdv: t.fdv,
            liquidity: t.liquidity,
            volume24h: t.volume24h,
            riskScore,
            riskLevel,
            contract: t.address,
            devWallet: 'Data not available on-chain',
            devActivity: 'Check SuiScan for details',
            devHolding: 'N/A',
            holders: 'N/A',
            imageUrl: t.imageUrl,
            pairUrl: t.url,
            websites: t.websites || [],
            socials: t.socials || [],
            buyPressure,
            pairAddress: t.pairAddress,
            topHolders: [],
            recentTxns: [],
            chart: [
              { time: '00:00', price: parseFloat(t.priceRaw) * 0.92 },
              { time: '04:00', price: parseFloat(t.priceRaw) * 0.95 },
              { time: '08:00', price: parseFloat(t.priceRaw) * 1.03 },
              { time: '12:00', price: parseFloat(t.priceRaw) * 1.01 },
              { time: '16:00', price: parseFloat(t.priceRaw) * 0.98 },
              { time: '20:00', price: parseFloat(t.priceRaw) * 1.02 },
              { time: '23:59', price: parseFloat(t.priceRaw) },
            ],
          })
        } else {
          setToken(null)
        }
        setLoading(false)
      })
    .catch(() => { setLoading(false); setToken(null) })
    }, 0)
    return () => clearTimeout(timer)
  }, [symbol, API])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1C2C' }}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 rounded-full mx-auto mb-4"
          style={{ borderColor: '#4DA2FF', borderTopColor: 'transparent' }}
        />
        <p style={{ color: '#4DA2FF77' }}>Loading token data...</p>
      </div>
    </div>
  )

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1C2C' }}>
      <div className="text-center">
        <p className="text-xl font-bold mb-2" style={{ color: '#F8FAFC' }}>Token not found</p>
        <p className="text-sm mb-6" style={{ color: '#4DA2FF77' }}>This token was not found on DexScreener</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)', color: '#0B1C2C' }}
        >
          Go Back
        </motion.button>
      </div>
    </div>
  )

  const risk = riskColor(token.riskLevel)

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: '#F8FAFC', background: '#0B1C2C' }}>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-8"
        style={{ color: '#4DA2FF' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </motion.button>

      {/* Token Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)', color: '#0B1C2C' }}>
            {token.imageUrl
              ? <img src={token.imageUrl} alt={token.symbol} className="w-14 h-14 object-contain rounded-2xl" onError={(e) => e.target.style.display = 'none'} />
              : token.symbol?.[0]
            }
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#F8FAFC' }}>{token.symbol}</h1>
            <p style={{ color: '#4DA2FF77' }}>{token.name}</p>
            {token.websites?.length > 0 && (
              <a href={token.websites[0].url} target="_blank" rel="noopener noreferrer"
                className="text-xs hover:underline" style={{ color: '#4DA2FF' }}>
                {token.websites[0].label || 'Website'} ↗
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: '#F8FAFC' }}>{token.price}</p>
            <p className="font-semibold" style={{ color: token.positive ? '#4ade80' : '#f87171' }}>
              {token.change} (24h)
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            style={{ background: risk.bg, border: `1px solid ${risk.border}`, color: risk.color }}>
            {token.riskLevel === 'SAFE' ? <Shield className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {token.riskLevel} — {token.riskScore}/100
          </div>
          {token.pairUrl && (
            <motion.a
              href={token.pairUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
              style={{ background: 'rgba(77,162,255,0.08)', border: '1px solid rgba(77,162,255,0.2)', color: '#4DA2FF' }}
            >
              DexScreener <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Market Cap', value: token.marketCap, icon: TrendingUp, color: '#4DA2FF' },
          { label: 'FDV', value: token.fdv, icon: Activity, color: '#6FE3FF' },
          { label: 'Liquidity', value: token.liquidity, icon: Wallet, color: '#7DD3FC' },
          { label: 'Volume (24h)', value: token.volume24h, icon: Users, color: '#a78bfa' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
              border: '1px solid rgba(77,162,255,0.12)',
            }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
              <m.icon className="w-4 h-4" style={{ color: m.color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: '#F8FAFC' }}>{m.value || 'N/A'}</p>
            <p className="text-xs" style={{ color: '#4DA2FF66' }}>{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Price Chart + Buy/Sell Pressure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard delay={0.1} className="md:col-span-2">
          <h3 className="text-lg font-bold mb-1" style={{ color: '#F8FAFC' }}>Price Chart</h3>
          <p className="text-xs mb-4" style={{ color: '#4DA2FF66' }}>Live chart powered by DexScreener</p>
          {token.pairAddress ? (
            <div className="rounded-xl overflow-hidden" style={{ height: '400px' }}>
              <iframe
                src={`https://dexscreener.com/sui/${token.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Price Chart"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl h-48"
              style={{ background: 'rgba(77,162,255,0.04)', border: '1px solid rgba(77,162,255,0.1)' }}>
              <p className="text-sm" style={{ color: '#4DA2FF55' }}>Chart not available for this token</p>
            </div>
          )}
        </GlassCard>

        <GlassCard delay={0.15}>
          <h3 className="text-lg font-bold mb-1" style={{ color: '#F8FAFC' }}>Buy/Sell Pressure</h3>
          <p className="text-xs mb-6" style={{ color: '#4DA2FF66' }}>Last 24 hours</p>
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(248,113,113,0.2)" strokeWidth="10" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#4DA2FF" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - token.buyPressure / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-black" style={{ color: '#4DA2FF' }}>{token.buyPressure}%</p>
                <p className="text-xs" style={{ color: '#4DA2FF77' }}>Buy</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#4ade80' }}>Buy {token.buyPressure}%</span>
                <span style={{ color: '#f87171' }}>Sell {100 - token.buyPressure}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(248,113,113,0.3)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #4DA2FF, #6FE3FF)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${token.buyPressure}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Contract Info */}
      <GlassCard delay={0.2} className="mb-8">
        <h3 className="text-lg font-bold mb-5" style={{ color: '#F8FAFC' }}>Contract Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <CopyRow label="Contract Address" value={token.contract} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl p-4"
              style={{ background: 'rgba(77,162,255,0.04)', border: '1px solid rgba(77,162,255,0.1)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>Risk Score</span>
                <span className="font-black text-lg" style={{ color: risk.color }}>{token.riskScore}/100</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: token.riskScore >= 70
                      ? 'linear-gradient(90deg, #FF4444, #FF8888)'
                      : token.riskScore >= 40
                      ? 'linear-gradient(90deg, #f97316, #fdba74)'
                      : 'linear-gradient(90deg, #4ade80, #86efac)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${token.riskScore}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs" style={{ color: '#4DA2FF88' }}>
                <p>Liquidity: <span style={{ color: '#F8FAFC' }}>{token.liquidity}</span></p>
                <p>24h Volume: <span style={{ color: '#F8FAFC' }}>{token.volume24h}</span></p>
                <p>Buy/Sell ratio: <span style={{ color: '#F8FAFC' }}>{token.buyPressure}% buys</span></p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Socials + Links */}
      {(token.socials?.length > 0 || token.websites?.length > 0) && (
        <GlassCard delay={0.25} className="mb-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#F8FAFC' }}>Links & Socials</h3>
          <div className="flex flex-wrap gap-3">
            {token.websites?.map((w, i) => (
              <motion.a
                key={i}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'rgba(77,162,255,0.08)', border: '1px solid rgba(77,162,255,0.2)', color: '#4DA2FF' }}
              >
                {w.label || 'Website'} <ExternalLink className="w-3 h-3" />
              </motion.a>
            ))}
            {token.socials?.map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium capitalize"
                style={{ background: 'rgba(77,162,255,0.08)', border: '1px solid rgba(77,162,255,0.2)', color: '#4DA2FF' }}
              >
                {s.type} <ExternalLink className="w-3 h-3" />
              </motion.a>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Note about holders and transactions */}
      <GlassCard delay={0.3} className="mb-20">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: '#fbbf24' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>
              Top holders and transaction history
            </p>
          <p className="text-xs mt-1" style={{ color: '#4DA2FF77' }}>
              For detailed holder distribution and transaction history, view this token on{' '}
              <a href={`https://suiscan.xyz/mainnet/coin/${token.contract}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#4DA2FF' }}>SuiScan</a>
              {' '}or{' '}
              <a href={token.pairUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#4DA2FF' }}>DexScreener</a>.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
