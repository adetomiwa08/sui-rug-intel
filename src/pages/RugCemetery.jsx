import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Skull, Search, TrendingDown, Wallet,
  Users, Clock, ExternalLink, ChevronRight, Flame
} from 'lucide-react'

const deadTokens = [
  {
    id: 1, token: 'SUIINU', name: 'SUI Inu', dateDied: 'Mar 15, 2026',
    causeOfDeath: 'Liquidity Drain', liquidityStolen: '$1.2M',
    holders: '9,441', devWallet: '0x9a7b...4f2c',
    peakMcap: '$4.8M', rugScore: 99,
    description: 'Classic rug. Dev accumulated 31% of supply, deleted Telegram and drained all liquidity in a single transaction at 3AM.',
    txHash: '0xdead...beef01',
    rip: '💀 Gone in 6 days',
  },
  {
    id: 2, token: 'MOONCAT', name: 'Moon Cat Finance', dateDied: 'Mar 17, 2026',
    causeOfDeath: 'Dev Dump', liquidityStolen: '$842K',
    holders: '4,821', devWallet: '0x4f2a...9c1d',
    peakMcap: '$2.1M', rugScore: 97,
    description: 'Dev wallet sold 100% of holdings over 48 hours while posting bullish updates in their Telegram.',
    txHash: '0xdead...beef02',
    rip: '💀 Gone in 11 days',
  },
  {
    id: 3, token: 'SAFEMOON2', name: 'Safe Moon 2.0', dateDied: 'Mar 16, 2026',
    causeOfDeath: 'Honeypot', liquidityStolen: '$380K',
    holders: '2,210', devWallet: '0x3k9l...2m1n',
    peakMcap: '$1.4M', rugScore: 95,
    description: 'Contract had a hidden sell restriction. Buyers could not sell. Dev drained the liquidity pool after accumulating enough buys.',
    txHash: '0xdead...beef03',
    rip: '💀 Gone in 3 days',
  },
  {
    id: 4, token: 'ROCKETMOON', name: 'Rocket Moon', dateDied: 'Mar 10, 2026',
    causeOfDeath: 'Mint Attack', liquidityStolen: '$620K',
    holders: '3,890', devWallet: '0x5r6s...7t8u',
    peakMcap: '$3.2M', rugScore: 93,
    description: 'Dev used a hidden mint function to create 10 billion new tokens and dumped them all on unsuspecting holders.',
    txHash: '0xdead...beef04',
    rip: '💀 Gone in 8 days',
  },
  {
    id: 5, token: 'SUICAT', name: 'SUI Cat', dateDied: 'Mar 5, 2026',
    causeOfDeath: 'Liquidity Drain', liquidityStolen: '$290K',
    holders: '1,102', devWallet: '0x9v0w...1x2y',
    peakMcap: '$980K', rugScore: 91,
    description: 'Liquidity was never locked. Dev pulled it all 4 days after launch. Website went offline same day.',
    txHash: '0xdead...beef05',
    rip: '💀 Gone in 4 days',
  },
  {
    id: 6, token: 'AQUADOGE', name: 'Aqua Doge', dateDied: 'Feb 28, 2026',
    causeOfDeath: 'Dev Dump', liquidityStolen: '$174K',
    holders: '780', devWallet: '0x3z4a...5b6c',
    peakMcap: '$540K', rugScore: 88,
    description: 'Small cap meme coin. Dev held 22% and sold everything within 72 hours of launch with no warning.',
    txHash: '0xdead...beef06',
    rip: '💀 Gone in 3 days',
  },
]

const causes = ['ALL', 'Liquidity Drain', 'Dev Dump', 'Honeypot', 'Mint Attack']

const causeColor = (cause) => {
  if (cause === 'Liquidity Drain') return { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)' }
  if (cause === 'Dev Dump') return { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' }
  if (cause === 'Honeypot') return { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' }
  if (cause === 'Mint Attack') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' }
  return { color: '#4DA2FF', bg: 'rgba(77,162,255,0.1)', border: 'rgba(77,162,255,0.25)' }
}

const totalStolen = '$3.5M'
const totalVictims = '22,244'
const totalRugs = deadTokens.length

export default function RugCemetery() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  const filtered = deadTokens.filter((t) => {
    const matchFilter = activeFilter === 'ALL' || t.causeOfDeath === activeFilter
    const matchSearch = t.token.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: '#F8FAFC' }}>

      {/* Header */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="mb-10 text-center relative py-10 overflow-hidden"
>
  {/* Dramatic background glow */}
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
      style={{ background: 'radial-gradient(ellipse, rgba(255,68,68,0.08) 0%, transparent 70%)' }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Falling particles */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-lg"
        style={{ left: `${(i * 8.5) % 100}%`, top: '-10%' }}
        animate={{ y: ['0vh', '110vh'], opacity: [0, 1, 0], rotate: [0, 360] }}
        transition={{
          duration: 4 + (i % 4),
          repeat: Infinity,
          delay: i * 0.6,
          ease: 'linear',
        }}
      >
        {i % 3 === 0 ? '💀' : i % 3 === 1 ? '🪦' : '⚰️'}
      </motion.div>
    ))}
  </div>

  {/* Main skull */}
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
    className="relative z-10 inline-block mb-6"
  >
    <motion.div
      animate={{ scale: [1, 1.08, 1], filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="text-7xl"
    >
      💀
    </motion.div>
    {/* Ripple rings */}
    {[1, 2, 3].map((ring) => (
      <motion.div
        key={ring}
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: 'rgba(255,68,68,0.3)' }}
        animate={{ scale: [1, 2.5 + ring * 0.5], opacity: [0.6, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: ring * 0.5,
          ease: 'easeOut',
        }}
      />
    ))}
  </motion.div>

  {/* Title — letter by letter */}
  {/* Title */}
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.4 }}
    className="relative z-10 text-4xl font-black mb-2"
    style={{
      background: 'linear-gradient(135deg, #F8FAFC, #9ca3af)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    Rug Cemetery
  </motion.h1>

  {/* Subtitle flicker */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0.7, 1] }}
    transition={{ duration: 1.5, delay: 1.5 }}
    className="relative z-10 text-sm max-w-xl mx-auto mt-4"
    style={{ color: 'rgba(255,68,68,0.6)' }}
  >
    A permanent record of every rug pull on the SUI blockchain.
  </motion.p>
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2 }}
    className="relative z-10 text-xs max-w-xl mx-auto mt-1"
    style={{ color: '#4DA2FF44' }}
  >
    They rugged. We remember.{' '}
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ color: 'rgba(255,68,68,0.5)' }}
    >
      Forever on-chain.
    </motion.span>
  </motion.p>

  {/* Divider line */}
  <motion.div
    className="relative z-10 mx-auto mt-6 h-[1px]"
    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,68,68,0.3), transparent)' }}
    initial={{ width: 0 }}
    animate={{ width: '60%' }}
    transition={{ duration: 1.5, delay: 1.8 }}
  />
  </motion.div>

      {/* Cemetery Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Rugs', value: totalRugs, icon: Skull, color: '#FF4444' },
          { label: 'Total Stolen', value: totalStolen, icon: Flame, color: '#f97316' },
          { label: 'Victims', value: totalVictims, icon: Users, color: '#a78bfa' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
              border: `1px solid ${s.color}22`,
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
              style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-black" style={{ color: '#F8FAFC' }}>{s.value}</p>
            <p className="text-xs" style={{ color: `${s.color}99` }}>{s.label}</p>
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          {causes.map((c) => {
            const cc = causeColor(c)
            const isActive = activeFilter === c
            return (
              <button
                key={c}
                onClick={() => setActiveFilter(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: isActive ? cc.bg : 'transparent',
                  border: isActive ? `1px solid ${cc.border}` : '1px solid rgba(77,162,255,0.1)',
                  color: isActive ? cc.color : '#4DA2FF66',
                }}
              >
                {c}
              </button>
            )
          })}
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
            placeholder="Search rugged token..."
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#F8FAFC' }}
          />
        </div>
      </div>

      {/* Tombstone Cards */}
      <div className="flex flex-col gap-4 pb-20">
        <AnimatePresence>
          {filtered.map((token, i) => {
            const cc = causeColor(token.causeOfDeath)
            const isExpanded = expanded === token.id

            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
                  border: `1px solid ${isExpanded ? cc.border : 'rgba(77,162,255,0.08)'}`,
                  boxShadow: isExpanded ? `0 0 30px ${cc.color}15` : 'none',
                }}
              >
                {/* Main Row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : token.id)}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      className="text-2xl"
                    >
                      💀
                    </motion.div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-lg" style={{ color: '#F8FAFC' }}>{token.token}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: cc.bg, color: cc.color, border: `1px solid ${cc.border}` }}>
                          {token.causeOfDeath}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#4DA2FF55' }}>
                        {token.name} · {token.rip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold" style={{ color: '#FF4444' }}>{token.liquidityStolen}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF44' }}>stolen</span>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-semibold" style={{ color: '#9ca3af' }}>{token.peakMcap}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF44' }}>peak mcap</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs" style={{ color: '#4DA2FF44' }}>{token.dateDied}</span>
                      <span className="text-xs mt-1" style={{ color: '#4DA2FF33' }}>{token.holders} victims</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: '#4DA2FF44' }} />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ borderTop: `1px solid rgba(77,162,255,0.08)` }}
                    >
                      <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Story */}
                        <div className="md:col-span-2">
                          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#4DA2FF66' }}>
                            What Happened
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: '#F8FAFCcc' }}>
                            {token.description}
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#4DA2FF55' }}>Rug TX:</span>
                            <code className="text-xs px-2 py-1 rounded"
                              style={{ background: 'rgba(77,162,255,0.06)', color: '#6FE3FF' }}>
                              {token.txHash}
                            </code>
                          </div>
                        </div>

                        {/* Stats + Actions */}
                        <div className="flex flex-col gap-3">
                          <p className="text-xs uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>Details</p>
                          {[
                            { label: 'Rug Score', value: `${token.rugScore}/100` },
                            { label: 'Dev Wallet', value: token.devWallet },
                            { label: 'Holders Affected', value: token.holders },
                            { label: 'Date of Death', value: token.dateDied },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between text-xs">
                              <span style={{ color: '#4DA2FF66' }}>{item.label}</span>
                              <span style={{ color: '#F8FAFC' }}>{item.value}</span>
                            </div>
                          ))}

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/token/${token.token}`)}
                            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
                              color: '#0B1C2C',
                            }}
                          >
                            Full Autopsy <ChevronRight className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.open(`https://suivision.xyz/txblock/${token.txHash}`, '_blank')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                              background: 'rgba(255,68,68,0.08)',
                              border: '1px solid rgba(255,68,68,0.2)',
                              color: '#FF4444',
                            }}
                          >
                            View Rug TX <ExternalLink className="w-4 h-4" />
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
            <Skull className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No rugs found matching your search</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}