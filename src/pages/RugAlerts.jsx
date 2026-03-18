import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Filter, Search, Clock,
  TrendingDown, Wallet, ExternalLink, ChevronRight
} from 'lucide-react'

const alerts = [
  {
    id: 1, token: 'MOONCAT', name: 'Moon Cat Finance',
    risk: 'RUG', riskScore: 97, time: '2m ago', status: 'CONFIRMED RUG',
    devWallet: '0x4f2a...9c1d', liquidityDrained: '$842K',
    holders: '4,821', change: '-99.8%',
    reason: ['Liquidity removed', 'Dev wallet dumped 100%', 'Contract ownership not renounced'],
  },
  {
    id: 2, token: 'SUIPEPE', name: 'SUI Pepe',
    risk: 'HIGH', riskScore: 84, time: '8m ago', status: 'SUSPICIOUS',
    devWallet: '0x8b1c...3e2f', liquidityDrained: '$210K',
    holders: '1,203', change: '-42.1%',
    reason: ['Dev wallet holds 28%', 'No audit', 'Honeypot detected'],
  },
  {
    id: 3, token: 'SUIDOGE', name: 'SUI Doge',
    risk: 'HIGH', riskScore: 78, time: '15m ago', status: 'SUSPICIOUS',
    devWallet: '0x2d9f...7a4b', liquidityDrained: '$94K',
    holders: '892', change: '-18.4%',
    reason: ['Mint function active', 'Dev selling steadily'],
  },
  {
    id: 4, token: 'ROCKETX', name: 'Rocket X',
    risk: 'MEDIUM', riskScore: 61, time: '22m ago', status: 'WATCH',
    devWallet: '0x6e3c...1d8a', liquidityDrained: '$0',
    holders: '3,100', change: '-8.2%',
    reason: ['Unverified contract', 'Low liquidity'],
  },
  {
    id: 5, token: 'SUIINU', name: 'SUI Inu',
    risk: 'RUG', riskScore: 99, time: '31m ago', status: 'CONFIRMED RUG',
    devWallet: '0x9a7b...4f2c', liquidityDrained: '$1.2M',
    holders: '9,441', change: '-100%',
    reason: ['Liquidity fully drained', 'Dev vanished', 'Telegram deleted'],
  },
  {
    id: 6, token: 'SAFEMOON2', name: 'Safe Moon 2.0',
    risk: 'RUG', riskScore: 95, time: '45m ago', status: 'CONFIRMED RUG',
    devWallet: '0x3k9l...2m1n', liquidityDrained: '$380K',
    holders: '2,210', change: '-98.2%',
    reason: ['Copy of known rug contract', 'Liquidity removed in single tx'],
  },
  {
    id: 7, token: 'SUIFLOKI', name: 'SUI Floki',
    risk: 'HIGH', riskScore: 81, time: '52m ago', status: 'SUSPICIOUS',
    devWallet: '0x7p2q...8r3s', liquidityDrained: '$44K',
    holders: '601', change: '-31.7%',
    reason: ['Dev wallet active selling', 'No liquidity lock'],
  },
  {
    id: 8, token: 'AQUAFI', name: 'Aqua Finance',
    risk: 'MEDIUM', riskScore: 58, time: '1h ago', status: 'WATCH',
    devWallet: '0x1z2y...3x4w', liquidityDrained: '$0',
    holders: '1,840', change: '-5.1%',
    reason: ['New contract < 24h old', 'Small liquidity pool'],
  },
]

const riskConfig = {
  RUG: { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)', glow: '0 0 20px rgba(255,68,68,0.15)' },
  HIGH: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', glow: '0 0 20px rgba(249,115,22,0.1)' },
  MEDIUM: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', glow: 'none' },
  LOW: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)', glow: 'none' },
}

const filters = ['ALL', 'RUG', 'HIGH', 'MEDIUM', 'WATCH']

const summaryStats = [
  { label: 'Rugs Today', value: '3', color: '#FF4444', icon: TrendingDown },
  { label: 'High Risk', value: '3', color: '#f97316', icon: AlertTriangle },
  { label: 'Under Watch', value: '2', color: '#fbbf24', icon: Clock },
  { label: 'Wallets Affected', value: '22.3K', color: '#4DA2FF', icon: Wallet },
]

export default function RugAlerts() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

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
        <div className="flex items-center gap-2">
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
          style={{
            background: 'rgba(13,31,45,0.9)',
            border: '1px solid rgba(77,162,255,0.15)',
          }}>
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
        <AnimatePresence>
          {filtered.map((alert, i) => {
            const rc = riskConfig[alert.risk]
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
                    {/* Risk indicator */}
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        animate={alert.risk === 'RUG' ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <AlertTriangle className="w-5 h-5" style={{ color: rc.color }} />
                      </motion.div>
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
                      <span className="text-xs" style={{ color: '#4DA2FF55' }}>drained</span>
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
                            { label: 'Holders', value: alert.holders },
                            { label: 'Dev Wallet', value: alert.devWallet },
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
                            onClick={() => navigate(`/token/${alert.token}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                              background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
                              color: '#0B1C2C',
                            }}
                          >
                            View Full Analysis <ChevronRight className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                              background: 'rgba(77,162,255,0.08)',
                              border: '1px solid rgba(77,162,255,0.2)',
                              color: '#4DA2FF',
                            }}
                          >
                            Track Dev Wallet <ExternalLink className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
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