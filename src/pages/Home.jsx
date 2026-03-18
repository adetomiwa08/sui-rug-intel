import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { useNavigate } from 'react-router-dom'
import suiLogo from '../assets/sui-logo.png'
import { Search, AlertTriangle, Activity, Wallet, TrendingUp, ChevronRight, Zap } from 'lucide-react'

const stats = [
  { label: 'Total Transactions', value: 1200000000, display: '1.2B', icon: Activity, color: '#4DA2FF' },
  { label: 'Active Wallets', value: 4800000, display: '4.8M', icon: Wallet, color: '#6FE3FF' },
  { label: 'Tokens Tracked', value: 12400, display: '12,400', icon: TrendingUp, color: '#7DD3FC' },
  { label: 'Rugs Detected', value: 847, display: '847', icon: AlertTriangle, color: '#FF4444' },
]

const rugAlerts = [
  { token: 'MOONCAT', wallet: '0x4f2a...9c1d', risk: 'RUG', time: '2m ago' },
  { token: 'SUIPEPE', wallet: '0x8b1c...3e2f', risk: 'HIGH', time: '8m ago' },
  { token: 'SUIDOGE', wallet: '0x2d9f...7a4b', risk: 'HIGH', time: '15m ago' },
  { token: 'ROCKETX', wallet: '0x6e3c...1d8a', risk: 'MEDIUM', time: '22m ago' },
  { token: 'SUIINU', wallet: '0x9a7b...4f2c', risk: 'RUG', time: '31m ago' },
  { token: 'SAFEMOON2', wallet: '0x3k9l...2m1n', risk: 'RUG', time: '45m ago' },
  { token: 'SUIFLOKI', wallet: '0x7p2q...8r3s', risk: 'HIGH', time: '52m ago' },
]

const flaggedContracts = [
  { token: 'MOONCAT', address: '0x4f2a...9c1d', score: 94, devWallet: '0x1a2b...3c4d', status: 'RUGGED' },
  { token: 'SUIPEPE', address: '0x8b1c...3e2f', score: 81, devWallet: '0x5e6f...7g8h', status: 'SUSPICIOUS' },
  { token: 'ROCKETX', address: '0x6e3c...1d8a', score: 67, devWallet: '0x9i0j...1k2l', status: 'SUSPICIOUS' },
  { token: 'SUIDOGE', address: '0x2d9f...7a4b', score: 55, devWallet: '0x3m4n...5o6p', status: 'WATCH' },
]

const riskBadge = (risk) => {
  if (risk === 'RUG') return 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-rug-glow'
  if (risk === 'HIGH') return 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
  if (risk === 'MEDIUM') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
  return 'bg-green-500/20 text-green-400 border border-green-500/40'
}

const statusColor = (status) => {
  if (status === 'RUGGED') return 'text-red-400'
  if (status === 'SUSPICIOUS') return 'text-orange-400'
  if (status === 'WATCH') return 'text-yellow-400'
  return 'text-green-400'
}

function useCountUp(target, duration = 2200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function formatCount(count) {
  if (count >= 1000000000) return (count / 1000000000).toFixed(1) + 'B'
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  return count.toLocaleString()
}

function StatCard({ stat, index }) {
  const count = useCountUp(stat.value, 2000 + index * 200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.12 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="gradient-border group cursor-default relative overflow-hidden p-5 flex flex-col gap-3"
      style={{ background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))' }}
    >
      {/* Hover glow sweep */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}15, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
      >
        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
      </div>

      {/* Count */}
      <p className="text-3xl font-bold text-sui-white tabular-nums" style={{ color: '#F8FAFC' }}>
        {formatCount(count)}
      </p>
      <p className="text-sm" style={{ color: '#4DA2FF99' }}>{stat.label}</p>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
        initial={{ width: 0 }}
        animate={{ width: '60%' }}
        transition={{ duration: 1.2, delay: 0.5 + index * 0.1 }}
      />
    </motion.div>
  )
}


function WaterBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Base grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexgrid" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,17 58,47 30,62 2,47 2,17" fill="none" stroke="#4DA2FF" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexgrid)" />
      </svg>

      {/* Deep glow orbs — water feel */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(77,162,255,0.07) 0%, transparent 65%)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full -top-40 -left-40"
        style={{ background: 'radial-gradient(circle, rgba(111,227,255,0.06) 0%, transparent 65%)' }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full -bottom-20 -right-20"
        style={{ background: 'radial-gradient(circle, rgba(77,162,255,0.05) 0%, transparent 65%)' }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating dots */}
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: (i % 3) + 2,
            height: (i % 3) + 2,
            left: `${(i * 7.3) % 100}%`,
            top: `${(i * 11.7) % 100}%`,
            background: i % 4 === 0 ? '#6FE3FF' : '#4DA2FF',
            opacity: 0.12,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.08, 0.22, 0.08],
          }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle horizontal wave lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute left-0 right-0 h-[1px]"
          style={{
            top: `${25 + i * 25}%`,
            background: 'linear-gradient(90deg, transparent, rgba(77,162,255,0.08), rgba(111,227,255,0.06), transparent)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  )
}

function TickerBar() {
  const doubled = [...rugAlerts, ...rugAlerts]
  return (
    <div className="w-full border-y overflow-hidden py-2.5"
      style={{ borderColor: 'rgba(77,162,255,0.15)', background: 'rgba(77,162,255,0.04)' }}>
      <div className="flex items-center">
        <div className="shrink-0 px-4 flex items-center gap-2 border-r mr-4"
          style={{ borderColor: 'rgba(77,162,255,0.2)' }}>
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-400"
          />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4DA2FF' }}>Live</span>
        </div>
        <div className="overflow-hidden flex-1">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            {doubled.map((alert, i) => (
              <span key={i} className="flex items-center gap-2 text-xs shrink-0">
                <span className="font-bold" style={{ color: '#F8FAFC' }}>{alert.token}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${riskBadge(alert.risk)}`}>{alert.risk}</span>
                <span style={{ color: '#4DA2FF66' }}>{alert.wallet}</span>
                <span style={{ color: '#4DA2FF33' }} className="mx-1">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [alertIndex, setAlertIndex] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % rugAlerts.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen text-sui-white overflow-x-hidden" style={{ background: '#0B1C2C' }}>

      {/* Scan line */}
      <div className="scan-line" />

      {/* Hero */}
      <section className="relative px-6 py-28 flex flex-col items-center text-center gap-8 overflow-hidden"
        style={{ borderBottom: '1px solid rgba(77,162,255,0.12)' }}>
        <WaterBackground />

        {/* SUI Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 150 }}
          className="relative z-10"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Glow behind logo */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: 'rgba(77,162,255,0.3)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img
              src={suiLogo}
              alt="SUI"
              className="relative z-10 w-20 h-20 object-contain rounded-full"
              style={{
                background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
                padding: '10px',
                boxShadow: '0 0 30px rgba(77,162,255,0.4)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(77,162,255,0.08)',
            border: '1px solid rgba(77,162,255,0.25)',
            color: '#6FE3FF',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: '#6FE3FF' }}
          />
          Real-time SUI blockchain intelligence
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative z-10 text-5xl md:text-7xl font-bold leading-tight max-w-4xl"
          style={{ color: '#F8FAFC' }}
        >
          <span>The SUI </span>
          <span className="sui-text">Intelligence</span>
          <br />
          <TypeAnimation
            sequence={[
              'Rug Detection Engine.', 2500,
              'Whale Tracker.', 2000,
              'Contract Analyzer.', 2000,
              'On-Chain Shield.', 2000,
            ]}
            wrapper="span"
            speed={55}
            repeat={Infinity}
            style={{
              background: 'linear-gradient(135deg, #FF4444, #FF8888)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 text-lg max-w-xl"
          style={{ color: '#4DA2FF99' }}
        >
          Track wallets, analyze contracts, and stay ahead of rugs in real time on the SUI blockchain.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
            style={{
              background: 'rgba(13,31,45,0.9)',
              border: searchFocused
                ? '1px solid rgba(111,227,255,0.5)'
                : '1px solid rgba(77,162,255,0.2)',
              boxShadow: searchFocused ? '0 0 30px rgba(77,162,255,0.15)' : 'none',
            }}
          >
            <Search className="w-5 h-5 shrink-0" style={{ color: '#4DA2FF' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search wallet address, transaction hash, or token..."
              className="bg-transparent outline-none w-full text-sm"
              style={{ color: '#F8FAFC' }}
            />
           <motion.button
              onClick={() => { if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`) }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(77,162,255,0.4)' }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
                color: '#0B1C2C',
              }}
            >
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* Alert pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex items-center gap-3 px-5 py-2.5 rounded-full text-sm"
          style={{
            background: 'rgba(255,68,68,0.08)',
            border: '1px solid rgba(255,68,68,0.2)',
          }}
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Zap className="w-4 h-4 text-red-400 shrink-0" />
          </motion.div>
          <span style={{ color: '#4DA2FF88' }}>Latest alert:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={alertIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="font-semibold text-red-400"
            >
              {rugAlerts[alertIndex].token}
            </motion.span>
          </AnimatePresence>
          <span style={{ color: '#4DA2FF88' }}>flagged as</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`r-${alertIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`font-bold text-xs px-2.5 py-0.5 rounded-full ${riskBadge(rugAlerts[alertIndex].risk)}`}
            >
              {rugAlerts[alertIndex].risk}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Ticker */}
      <TickerBar />

      {/* Stats */}
      <section className="px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </section>

      {/* Live Rug Alerts */}
      <section className="px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full inline-block bg-red-400"
            />
            <h2 className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>Live Rug Alerts</h2>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center gap-1 text-sm"
            style={{ color: '#4DA2FF' }}
          >
            View all <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex flex-col gap-3">
          {rugAlerts.slice(0, 5).map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ x: 6, borderColor: 'rgba(255,68,68,0.4)', boxShadow: '0 0 20px rgba(255,68,68,0.08)' }}
              onClick={() => navigate(`/token/${alert.token}`)}
className="flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, rgba(13,31,45,0.85), rgba(11,28,44,0.9))',
                border: '1px solid rgba(77,162,255,0.1)',
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </motion.div>
                <span className="font-semibold" style={{ color: '#F8FAFC' }}>{alert.token}</span>
                <span className="text-sm hidden md:inline" style={{ color: '#4DA2FF66' }}>{alert.wallet}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskBadge(alert.risk)}`}>
                  {alert.risk}
                </span>
                <span className="text-xs" style={{ color: '#4DA2FF55' }}>{alert.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flagged Contracts */}
      <section className="px-6 py-6 max-w-6xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: '#F8FAFC' }}>Recently Flagged Contracts</h2>
          <motion.button whileHover={{ x: 5 }} className="flex items-center gap-1 text-sm" style={{ color: '#4DA2FF' }}>
            View all <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(77,162,255,0.12)', background: 'rgba(13,31,45,0.7)' }}
        >
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid rgba(77,162,255,0.1)', background: 'rgba(77,162,255,0.04)' }}>
              <tr>
                {['Token', 'Contract Address', 'Risk Score', 'Dev Wallet', 'Status'].map((h, i) => (
                  <th key={h} className={`text-left px-5 py-4 text-xs font-semibold tracking-wider uppercase ${i > 0 && i < 4 ? 'hidden md:table-cell' : ''}`}
                    style={{ color: '#4DA2FF77' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flaggedContracts.map((c, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ backgroundColor: 'rgba(77,162,255,0.04)' }}
                  onClick={() => navigate(`/token/${c.token}`)}
                  className="cursor-pointer transition-colors duration-150"
                  style={{ borderBottom: i < flaggedContracts.length - 1 ? '1px solid rgba(77,162,255,0.07)' : 'none' }}
                >
                  <td className="px-5 py-4 font-semibold" style={{ color: '#F8FAFC' }}>{c.token}</td>
                  <td className="px-5 py-4 hidden md:table-cell" style={{ color: '#4DA2FF66' }}>{c.address}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(77,162,255,0.1)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: c.score >= 80
                              ? 'linear-gradient(90deg, #FF4444, #FF8888)'
                              : c.score >= 60
                              ? 'linear-gradient(90deg, #F97316, #FDBA74)'
                              : 'linear-gradient(90deg, #EAB308, #FDE047)',
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${c.score}%` }}
                          transition={{ duration: 1.2, delay: 0.4 + i * 0.1 }}
                        />
                      </div>
                      <span className="font-bold text-sm"
                        style={{ color: c.score >= 80 ? '#FF4444' : c.score >= 60 ? '#F97316' : '#EAB308' }}>
                        {c.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell" style={{ color: '#4DA2FF66' }}>{c.devWallet}</td>
                  <td className={`px-5 py-4 font-semibold text-sm ${statusColor(c.status)}`}>{c.status}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

    </div>
  )
}