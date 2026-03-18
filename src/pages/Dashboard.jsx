import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Activity, Zap, Server, TrendingUp, Clock, Cpu, ChevronRight } from 'lucide-react'

const txVolumeData = [
  { day: 'Mon', volume: 4200000 },
  { day: 'Tue', volume: 5800000 },
  { day: 'Wed', volume: 5100000 },
  { day: 'Thu', volume: 7300000 },
  { day: 'Fri', volume: 6800000 },
  { day: 'Sat', volume: 4900000 },
  { day: 'Sun', volume: 6200000 },
]

const activeWalletsData = [
  { day: 'Mon', wallets: 180000 },
  { day: 'Tue', wallets: 220000 },
  { day: 'Wed', wallets: 195000 },
  { day: 'Thu', wallets: 310000 },
  { day: 'Fri', wallets: 275000 },
  { day: 'Sat', wallets: 190000 },
  { day: 'Sun', wallets: 240000 },
]

const gasFeesData = [
  { time: '00:00', fee: 0.0021 },
  { time: '04:00', fee: 0.0018 },
  { time: '08:00', fee: 0.0034 },
  { time: '12:00', fee: 0.0052 },
  { time: '16:00', fee: 0.0048 },
  { time: '20:00', fee: 0.0039 },
  { time: '23:59', fee: 0.0029 },
]

const topTokens = [
  { rank: 1, symbol: 'SUI', name: 'Sui', volume: '$842M', change: '+4.2%', positive: true, txns: '2.1M', marketCap: '$4.8B', fdv: '$5.2B' },
  { rank: 2, symbol: 'USDC', name: 'USD Coin', volume: '$310M', change: '+0.1%', positive: true, txns: '980K', marketCap: '$1.2B', fdv: '$1.2B' },
  { rank: 3, symbol: 'CETUS', name: 'Cetus Protocol', volume: '$128M', change: '-2.8%', positive: false, txns: '440K', marketCap: '$320M', fdv: '$480M' },
  { rank: 4, symbol: 'TURBOS', name: 'Turbos Finance', volume: '$84M', change: '+7.1%', positive: true, txns: '320K', marketCap: '$210M', fdv: '$350M' },
  { rank: 5, symbol: 'SUIFRENS', name: 'SuiFrens', volume: '$52M', change: '-1.4%', positive: false, txns: '210K', marketCap: '$98M', fdv: '$140M' },
  { rank: 6, symbol: 'BLUB', name: 'Blub', volume: '$41M', change: '+12.3%', positive: true, txns: '198K', marketCap: '$76M', fdv: '$95M' },
]

const networkStats = [
  { label: 'Current TPS', value: '4,821', icon: Zap, color: '#4DA2FF', sub: 'transactions/sec' },
  { label: 'Avg Block Time', value: '0.4s', icon: Clock, color: '#6FE3FF', sub: 'per epoch' },
  { label: 'Active Validators', value: '114', icon: Server, color: '#7DD3FC', sub: 'online now' },
  { label: 'Network Health', value: '99.9%', icon: Cpu, color: '#4ade80', sub: 'uptime' },
  { label: '24h Transactions', value: '12.4M', icon: Activity, color: '#a78bfa', sub: 'last 24 hours' },
  { label: 'SUI Price', value: '$1.84', icon: TrendingUp, color: '#34d399', sub: '+3.2% today' },
]

const CustomTooltip = ({ active, payload, label, suffix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: 'rgba(11,28,44,0.97)',
          border: '1px solid rgba(77,162,255,0.2)',
          boxShadow: '0 0 20px rgba(77,162,255,0.1)',
        }}>
        <p className="font-semibold mb-1" style={{ color: '#6FE3FF' }}>{label}</p>
        <p style={{ color: '#F8FAFC' }}>
          {typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}{suffix}
        </p>
      </div>
    )
  }
  return null
}

function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
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

function SectionHeader({ title, sub }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold" style={{ color: '#F8FAFC' }}>{title}</h2>
      {sub && <p className="text-sm mt-1" style={{ color: '#4DA2FF77' }}>{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('7d')
  const navigate = useNavigate()
  const tabs = ['24h', '7d', '30d']

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: '#F8FAFC' }}>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: '#4DA2FF' }}
          />
          <span className="text-sm font-medium" style={{ color: '#4DA2FF' }}>Live Network Data</span>
        </div>
        
        <h1 className="text-4xl font-bold" style={{
          background: 'linear-gradient(135deg, #F8FAFC, #4DA2FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          SUI Network Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: '#4DA2FF77' }}>
          Real-time analytics and network health for the SUI blockchain
        </p>
      </motion.div>

      {/* Network Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {networkStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative rounded-xl p-5 flex flex-col gap-3 overflow-hidden group cursor-default"
            style={{
              background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
              border: '1px solid rgba(77,162,255,0.12)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}12, transparent 70%)` }} />

            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: stat.color }}
              />
            </div>

            <div>
              <p className="text-2xl font-bold" style={{ color: '#F8FAFC' }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: `${stat.color}99` }}>{stat.sub}</p>
            </div>
            <p className="text-xs font-medium" style={{ color: '#4DA2FF66' }}>{stat.label}</p>

            <motion.div
              className="absolute bottom-0 left-0 h-[2px] rounded-full"
              style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              transition={{ duration: 1, delay: 0.4 + i * 0.08 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Time Tabs */}
      <div className="flex items-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === tab ? 'rgba(77,162,255,0.15)' : 'transparent',
              border: activeTab === tab ? '1px solid rgba(77,162,255,0.35)' : '1px solid rgba(77,162,255,0.1)',
              color: activeTab === tab ? '#6FE3FF' : '#4DA2FF66',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard delay={0.1}>
          <SectionHeader title="Transaction Volume" sub="Daily transactions over the last 7 days" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={txVolumeData}>
              <defs>
                <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4DA2FF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4DA2FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(77,162,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="volume" stroke="#4DA2FF" strokeWidth={2}
                fill="url(#txGrad)" dot={{ fill: '#4DA2FF', r: 3 }} activeDot={{ r: 5, fill: '#6FE3FF' }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard delay={0.2}>
          <SectionHeader title="Active Wallets" sub="Unique wallets active per day" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activeWalletsData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6FE3FF" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4DA2FF" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(77,162,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="wallets" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Gas Fees */}
      <GlassCard delay={0.3} className="mb-8">
        <SectionHeader title="Gas Fees Over Time" sub="Average transaction fee (SUI) — last 24 hours" />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={gasFeesData}>
            <defs>
              <linearGradient id="gasGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4DA2FF" />
                <stop offset="100%" stopColor="#6FE3FF" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(77,162,255,0.06)" />
            <XAxis dataKey="time" tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v.toFixed(3)} />
            <Tooltip content={<CustomTooltip suffix=" SUI" />} />
            <Line type="monotone" dataKey="fee" stroke="url(#gasGrad)" strokeWidth={2.5}
              dot={{ fill: '#4DA2FF', r: 3 }} activeDot={{ r: 5, fill: '#6FE3FF' }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Top Tokens Table */}
      <GlassCard delay={0.4}>
        <SectionHeader title="Top Tokens by Volume" sub="Click any token to view full details" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid rgba(77,162,255,0.1)' }}>
              <tr>
                {['#', 'Token', 'Market Cap', 'FDV', 'Volume (24h)', 'Change', 'Transactions', ''].map((h) => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold tracking-wider uppercase"
                    style={{ color: '#4DA2FF66' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topTokens.map((t, i) => (
                <motion.tr
                  key={t.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  whileHover={{ backgroundColor: 'rgba(77,162,255,0.06)' }}
                  onClick={() => navigate(`/token/${t.symbol}`)}
                  className="cursor-pointer transition-colors duration-150 group"
                  style={{ borderBottom: i < topTokens.length - 1 ? '1px solid rgba(77,162,255,0.06)' : 'none' }}
                >
                  <td className="py-4 pr-4" style={{ color: '#4DA2FF55' }}>{t.rank}</td>
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-bold" style={{ color: '#F8FAFC' }}>{t.symbol}</p>
                      <p className="text-xs" style={{ color: '#4DA2FF66' }}>{t.name}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-semibold" style={{ color: '#6FE3FF' }}>{t.marketCap}</td>
                  <td className="py-4 pr-4" style={{ color: '#4DA2FF99' }}>{t.fdv}</td>
                  <td className="py-4 pr-4 font-medium" style={{ color: '#F8FAFC' }}>{t.volume}</td>
                  <td className="py-4 pr-4 font-semibold"
                    style={{ color: t.positive ? '#4ade80' : '#f87171' }}>{t.change}</td>
                  <td className="py-4 pr-4" style={{ color: '#4DA2FF88' }}>{t.txns}</td>
                  <td className="py-4">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      whileHover={{ x: 3 }}
                    >
                      <ChevronRight className="w-4 h-4" style={{ color: '#4DA2FF' }} />
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}