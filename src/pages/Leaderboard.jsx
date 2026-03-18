import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Trophy, Skull, TrendingDown, Wallet,
  Users, Search, ExternalLink, ChevronRight, Flame, Shield
} from 'lucide-react'

const ruggers = [
  {
    rank: 1, address: '0x9a7b...4f2c', label: 'The Ghost',
    totalStolen: '$1.58M', rugs: 3, victims: '16,441',
    tokens: ['SUIINU', 'AQUADOGE', 'SUICAT'],
    lastActive: '2d ago', status: 'ACTIVE',
    notoriety: 99,
    bio: 'Most wanted dev on SUI. Runs coordinated multi-wallet rug operations. Never verified a contract.',
  },
  {
    rank: 2, address: '0x4f2a...9c1d', label: 'Moon Killer',
    totalStolen: '$842K', rugs: 1, victims: '4,821',
    tokens: ['MOONCAT'],
    lastActive: '1d ago', status: 'ACTIVE',
    notoriety: 94,
    bio: 'Posted bullish updates while dumping. Deleted socials within minutes of draining liquidity.',
  },
  {
    rank: 3, address: '0x3k9l...2m1n', label: 'Copy Paste Dev',
    totalStolen: '$620K', rugs: 2, victims: '5,420',
    tokens: ['SAFEMOON2', 'ROCKETMOON'],
    lastActive: '4d ago', status: 'LYING LOW',
    notoriety: 88,
    bio: 'Reuses known rug contracts with minor modifications. Targets retail with FOMO marketing.',
  },
  {
    rank: 4, address: '0x5r6s...7t8u', label: 'Mint Master',
    totalStolen: '$380K', rugs: 1, victims: '3,890',
    tokens: ['ROCKETMOON'],
    lastActive: '8d ago', status: 'LYING LOW',
    notoriety: 81,
    bio: 'Specialist in hidden mint functions. Waits for liquidity to build before executing.',
  },
  {
    rank: 5, address: '0x8b1c...3e2f', label: 'Slow Dumper',
    totalStolen: '$210K', rugs: 1, victims: '1,203',
    tokens: ['SUIPEPE'],
    lastActive: '8m ago', status: 'ACTIVE',
    notoriety: 74,
    bio: 'Sells slowly over days to avoid detection. Currently active — suspected new project launch imminent.',
  },
  {
    rank: 6, address: '0x7p2q...8r3s', label: 'No Lock Larry',
    totalStolen: '$174K', rugs: 1, victims: '780',
    tokens: ['SUIFLOKI'],
    lastActive: '12d ago', status: 'DORMANT',
    notoriety: 61,
    bio: 'Never locks liquidity. Relies on hype and influencer shills to attract buyers before exit.',
  },
]

const statusConfig = {
  ACTIVE: { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.3)', pulse: true },
  'LYING LOW': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', pulse: false },
  DORMANT: { color: '#4DA2FF', bg: 'rgba(77,162,255,0.1)', border: 'rgba(77,162,255,0.2)', pulse: false },
}

const rankStyle = (rank) => {
  if (rank === 1) return { color: '#FFD700', icon: '🥇' }
  if (rank === 2) return { color: '#C0C0C0', icon: '🥈' }
  if (rank === 3) return { color: '#CD7F32', icon: '🥉' }
  return { color: '#4DA2FF66', icon: `#${rank}` }
}

const tabs = ['Most Stolen', 'Most Victims', 'Most Rugs']

const summaryStats = [
  { label: 'Total Stolen', value: '$3.8M', icon: Flame, color: '#FF4444' },
  { label: 'Active Ruggers', value: '3', icon: Skull, color: '#f97316' },
  { label: 'Total Victims', value: '32.5K', icon: Users, color: '#a78bfa' },
  { label: 'Rugs Tracked', value: '9', icon: TrendingDown, color: '#fbbf24' },
]

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('Most Stolen')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  const filtered = ruggers.filter((r) =>
    r.address.toLowerCase().includes(search.toLowerCase()) ||
    r.label.toLowerCase().includes(search.toLowerCase()) ||
    r.tokens.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: '#F8FAFC' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative"
      >
        {/* Background glow */}
        <motion.div
          className="absolute -top-10 left-0 w-[400px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,215,0,0.05) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="flex items-center gap-3 mb-2 relative z-10">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-3xl"
          >
            🏆
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: '#FF4444' }}
              />
              <span className="text-sm font-medium" style={{ color: '#FF4444' }}>Live Tracking</span>
            </div>
            <h1 className="text-4xl font-black" style={{
              background: 'linear-gradient(135deg, #FFD700, #FF4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Rug Leaderboard
            </h1>
          </div>
        </div>
        <p className="text-sm relative z-10" style={{ color: '#4DA2FF66' }}>
  The most notorious rug pull developers on the SUI blockchain. Ranked by damage done.
</p>

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="relative z-10 inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full"
  style={{
    background: 'rgba(255,215,0,0.06)',
    border: '1px solid rgba(255,215,0,0.2)',
  }}
>
  <motion.span
    animate={{ scale: [1, 1.3, 1] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="text-base"
  >
    🏆
  </motion.span>
  <span className="text-sm font-black tracking-widest uppercase"
    style={{
      background: 'linear-gradient(135deg, #FFD700, #FF4444)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  >
    Hall of Shame
  </span>
  <motion.span
    animate={{ scale: [1, 1.3, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
    className="text-base"
  >
    🏆
  </motion.span>
</motion.div>
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

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
              style={{
                background: activeTab === tab ? 'rgba(255,215,0,0.1)' : 'transparent',
                border: activeTab === tab ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(77,162,255,0.1)',
                color: activeTab === tab ? '#FFD700' : '#4DA2FF66',
              }}
            >
              {tab}
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
            placeholder="Search wallet, label, or token..."
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#F8FAFC' }}
          />
        </div>
      </div>

      {/* Leaderboard Cards */}
      <div className="flex flex-col gap-4 pb-20">
        <AnimatePresence>
          {filtered.map((rugger, i) => {
            const rs = rankStyle(rugger.rank)
            const sc = statusConfig[rugger.status]
            const isExpanded = expanded === rugger.rank

            return (
              <motion.div
                key={rugger.rank}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: rugger.rank === 1
                    ? 'linear-gradient(135deg, rgba(255,215,0,0.04), rgba(11,28,44,0.95))'
                    : 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
                  border: rugger.rank === 1
                    ? '1px solid rgba(255,215,0,0.2)'
                    : `1px solid ${isExpanded ? 'rgba(77,162,255,0.2)' : 'rgba(77,162,255,0.08)'}`,
                  boxShadow: rugger.rank === 1 ? '0 0 30px rgba(255,215,0,0.06)' : 'none',
                }}
              >
                {/* Main Row */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : rugger.rank)}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="w-10 text-center">
                      {rugger.rank <= 3 ? (
                        <motion.span
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          className="text-2xl"
                        >
                          {rs.icon}
                        </motion.span>
                      ) : (
                        <span className="text-sm font-bold" style={{ color: rs.color }}>{rs.icon}</span>
                      )}
                    </div>

                    {/* Identity */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-base" style={{ color: '#F8FAFC' }}>
                          {rugger.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {sc.pulse && (
                            <motion.span
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-1.5 h-1.5 rounded-full inline-block"
                              style={{ background: sc.color }}
                            />
                          )}
                          {rugger.status}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: '#4DA2FF55' }}>
                        {rugger.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-black" style={{ color: '#FF4444' }}>{rugger.totalStolen}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF44' }}>stolen</span>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold" style={{ color: '#f87171' }}>{rugger.victims}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF44' }}>victims</span>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>{rugger.rugs}</span>
                      <span className="text-xs" style={{ color: '#4DA2FF44' }}>rugs</span>
                    </div>

                    {/* Notoriety bar */}
                    <div className="hidden md:flex flex-col gap-1 w-24">
                      <span className="text-xs" style={{ color: '#4DA2FF55' }}>Notoriety</span>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #FF4444, #FFD700)' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${rugger.notoriety}%` }}
                          transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
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
                      style={{ borderTop: '1px solid rgba(77,162,255,0.08)' }}
                    >
                      <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Bio */}
                        <div className="md:col-span-2">
                          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: '#4DA2FF66' }}>
                            Intel Report
                          </p>
                          <p className="text-sm leading-relaxed mb-4" style={{ color: '#F8FAFCcc' }}>
                            {rugger.bio}
                          </p>
                          <div>
                            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#4DA2FF66' }}>
                              Known Tokens
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {rugger.tokens.map((t) => (
                                <motion.button
                                  key={t}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => navigate(`/token/${t}`)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                  style={{
                                    background: 'rgba(255,68,68,0.1)',
                                    border: '1px solid rgba(255,68,68,0.25)',
                                    color: '#FF4444',
                                  }}
                                >
                                  <Skull className="w-3 h-3" /> {t}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <p className="text-xs uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>Actions</p>
                          {[
                            { label: 'Last Active', value: rugger.lastActive },
                            { label: 'Total Rugs', value: rugger.rugs },
                            { label: 'Total Victims', value: rugger.victims },
                            { label: 'Notoriety', value: `${rugger.notoriety}/100` },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between text-xs">
                              <span style={{ color: '#4DA2FF66' }}>{item.label}</span>
                              <span style={{ color: '#F8FAFC' }}>{item.value}</span>
                            </div>
                          ))}

                          <motion.button
                            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(77,162,255,0.3)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.open(`https://suivision.xyz/account/${rugger.address}`, '_blank')}
                            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
                              color: '#0B1C2C',
                            }}
                          >
                            Track Wallet <ExternalLink className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                            style={{
                              background: 'rgba(77,162,255,0.08)',
                              border: '1px solid rgba(77,162,255,0.2)',
                              color: '#4DA2FF',
                            }}
                          >
                            <Shield className="w-4 h-4" /> Report Dev
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
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No ruggers match your search</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}