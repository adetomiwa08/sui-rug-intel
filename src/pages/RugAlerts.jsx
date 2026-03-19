import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Filter, Search, Clock,
  TrendingDown, Wallet, ExternalLink, ChevronRight, Loader
} from 'lucide-react'

const riskConfig = {
  RUG: { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)', glow: '0 0 20px rgba(255,68,68,0.15)' },
  HIGH: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', glow: '0 0 20px rgba(249,115,22,0.1)' },
  MEDIUM: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', glow: 'none' },
  LOW: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)', glow: 'none' },
}

const filters = ['ALL', 'RUG', 'HIGH', 'MEDIUM', 'WATCH']

export default function RugAlerts() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || 'https://sui-rug-intel-backend.onrender.com'

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`${API}/api/dex/tokens`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data) {
            const flagged = data.data
              .filter(t => {
                const change = parseFloat(t.change24h?.replace(/[^0-9.-]/g, '') || 0)
                const isNegative = t.change24h?.includes('-')
                const drop = isNegative ? Math.abs(change) : 0
                return drop > 15 || t.liquidityRaw < 50000
              })
              .map((t, i) => {
                const change = parseFloat(t.change24h?.replace(/[^0-9.-]/g, '') || 0)
                const isNegative = t.change24h?.includes('-')
                const drop = isNegative ? Math.abs(change) : 0
                const risk = t.liquidityRaw < 5000 ? 'RUG'
                  : t.liquidityRaw < 20000 || drop > 50 ? 'HIGH'
                  : drop > 15 ? 'MEDIUM' : 'LOW'
                const riskScore = t.liquidityRaw < 5000 ? 95
                  : t.liquidityRaw < 20000 ? 80
                  : drop > 50 ? 75
                  : drop > 30 ? 60 : 45
                const status = risk === 'RUG' ? 'CONFIRMED RUG'
                  : risk === 'HIGH' ? 'SUSPICIOUS' : 'WATCH'
                const reasons = []
                if (t.liquidityRaw < 5000) reasons.push('Liquidity nearly drained')
                if (t.liquidityRaw < 20000) reasons.push('Very low liquidity')
                if (drop > 50) reasons.push(`Price dropped ${drop.toFixed(0)}% in 24h`)
                if (drop > 15) reasons.push('Significant price decline detected')
                if (t.sells24h > t.buys24h * 2) reasons.push('Heavy sell pressure detected')
                if (reasons.length === 0) reasons.push('Unusual trading activity detected')
                return {
                  id: i + 1,
                  token: t.symbol,
                  name: t.name,
                  risk,
                  riskScore,
                  time: 'Live',
                  status,
                  devWallet: 'Check SuiScan',
                  liquidityDrained: t.liquidity,
                  holders: 'N/A',
                  change: t.change24h,
                  reason: reasons,
                  address: t.address,
                  pairUrl: t.url,
                  imageUrl: t.imageUrl,
                }
              })
              .sort((a, b) => b.riskScore - a.riskScore)
            setAlerts(flagged)
          }
          setLoadingAlerts(false)
        })
        .catch(() => setLoadingAlerts(false))
    }, 0)
    return () => clearTimeout(timer)
  }, [API])

  // Dynamic summary stats
  const rugCount = alerts.filter(a => a.risk === 'RUG').length
  const highCount = alerts.filter(a => a.risk === 'HIGH').length
  const watchCount = alerts.filter(a => a.status === 'WATCH').length

  const summaryStats = [
    { label: 'Rugs Detected', value: rugCount.toString(), color: '#FF4444', icon: TrendingDown },
    { label: 'High Risk', value: highCount.toString(), color: '#f97316', icon: AlertTriangle },
    { label: 'Under Watch', value: watchCount.toString(), color: '#fbbf24', icon: Clock },
    { label: 'Tokens Flagged', value: alerts.length.toString(), color: '#4DA2FF', icon: Wallet },
  ]

  const filtered = alerts.filter((a) => {
    const matchFilter = activeFilter === 'ALL' || a.risk === activeFilter ||
      (activeFilter === 'WATCH' && a.status === 'WATCH')
    const matchSearch = a.token.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: '#F8FAFC' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.span
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: '#FF4444' }}
          />
          <span className="text-sm font-medium" style={{ color: '#FF4444' }}>Live Monitoring</span>
        </div>
        <h1 className="text-4xl font-bold" style={{
          background: 'linear-gradient(135deg, #F8FAFC, #FF4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Rug Alerts
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#4DA2FF77' }}>
          Real-time rug pull detection and risk monitoring across the SUI ecosystem
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {summaryStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
              border: `1px solid ${s.color}22`,
            }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-black" style={{ color: '#F8FAFC' }}>{s.value}</p>
            <p className="text-xs" style={{ color: `${s.color}99` }}>{s.label}</p>
            <motion.div
              className="absolute bottom-0 left-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 shrink-0" style={{ color: '#4DA2FF66' }} />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background: activeFilter === f
                  ? f === 'RUG' ? 'rgba(255,68,68,0.15)'
                  : f === 'HIGH' ? 'rgba(249,115,22,0.15)'
                  : f === 'MEDIUM' ? 'rgba(251,191,36,0.15)'
                  : 'rgba(77,162,255,0.15)'
                  : 'transparent',
                border: activeFilter === f
                  ? f === 'RUG' ? '1px solid rgba(255,68,68,0.35)'
                  : f === 'HIGH' ? '1px solid rgba(249,115,22,0.35)'
                  : f === 'MEDIUM' ? '1px solid rgba(251,191,36,0.35)'
                  : '1px solid rgba(77,162,255,0.35)'
                  : '1px solid rgba(77,162,255,0.1)',
                color: activeFilter === f
                  ? f === 'RUG' ? '#FF4444'
                  : f === 'HIGH' ? '#f97316'
                  : f === 'MEDIUM' ? '#fbbf24'
                  : '#6FE3FF'
                  : '#4DA2FF66',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(13,31,45,0.9)', border: '1px solid rgba(77,162,255,0.15)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: '#4DA2FF66' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search token name or symbol..."
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#F8FAFC' }}
          />
        </div>
      </div>

      {/* Alert Cards */}
      <div className="flex flex-col gap-4 pb-20">

        {/* Loading */}
        {loadingAlerts && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mx-auto mb-4"
              >
                <Loader className="w-10 h-10" style={{ color: '#FF4444' }} />
              </motion.div>
              <p className="text-sm" style={{ color: '#FF444477' }}>Scanning for rug patterns...</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {!loadingAlerts && filtered.map((alert, i) => {
            const rc = riskConfig[alert.risk] || riskConfig.LOW
            const isExpanded = expanded === alert.id

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
                  border: `1px solid ${rc.border}`,
                  boxShadow: isExpanded ? rc.glow : 'none',
                }}
              >
                {/* Main Row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : alert.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                      style={{ background: rc.bg, border: `1px solid ${rc.border}` }}>
                      {alert.imageUrl
                        ? <img src={alert.imageUrl} alt={alert.token} className="w-8 h-8 object-contain rounded-lg" onError={(e) => e.target.style.display = 'none'} />
                        : <AlertTriangle className="w-4 h-4" style={{ color: rc.color }} />
                      }
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg" style={{ color: '#F8FAFC' }}>{alert.token}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                          {alert.risk}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#4DA2FF66' }}>{alert.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold" style={{ color: '#f87171' }}>{alert.change}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF55' }}>price change</span>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{alert.liquidityDrained}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF55' }}>liquidity</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: rc.bg, color: rc.color }}>
                        {alert.status}
                      </span>
                      <span className="text-xs mt-1" style={{ color: '#4DA2FF44' }}>{alert.time}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: '#4DA2FF55' }} />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ borderTop: `1px solid ${rc.border}` }}
                    >
                      <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Risk Reasons */}
                        <div>
                          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#4DA2FF66' }}>
                            Risk Indicators
                          </p>
                          <div className="flex flex-col gap-2">
                            {alert.reason.map((r, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: rc.color }} />
                                <span className="text-sm" style={{ color: '#F8FAFC99' }}>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-col gap-3">
                          <p className="text-xs uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>Details</p>
                          {[
                            { label: 'Risk Score', value: `${alert.riskScore}/100` },
                            { label: 'Liquidity', value: alert.liquidityDrained },
                            { label: 'Price Change', value: alert.change },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between text-sm">
                              <span style={{ color: '#4DA2FF77' }}>{item.label}</span>
                              <span style={{ color: '#F8FAFC' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <p className="text-xs uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>Actions</p>
                          <motion.button
                            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(77,162,255,0.3)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/token/${alert.address || alert.token}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
                              color: '#0B1C2C',
                            }}
                          >
                            View Full Analysis <ChevronRight className="w-4 h-4" />
                          </motion.button>
                          {alert.pairUrl && (
                            <motion.a
                              href={alert.pairUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                              style={{
                                background: 'rgba(77,162,255,0.08)',
                                border: '1px solid rgba(77,162,255,0.2)',
                                color: '#4DA2FF',
                              }}
                            >
                              View on DexScreener <ExternalLink className="w-4 h-4" />
                            </motion.a>
                          )}
                          <motion.a
                            href={`https://suiscan.xyz/mainnet/coin/${alert.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                              background: 'rgba(255,68,68,0.08)',
                              border: '1px solid rgba(255,68,68,0.2)',
                              color: '#FF4444',
                            }}
                          >
                            View on SuiScan <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {!loadingAlerts && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            style={{ color: '#4DA2FF44' }}
          >
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No alerts match your filter</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
