import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import {
  ArrowLeft, AlertTriangle, Shield, Wallet,
  TrendingUp, Users, Activity, ExternalLink, Copy, Check
} from 'lucide-react'

const tokenData = {
  SUI: {
    name: 'Sui', symbol: 'SUI', price: '$1.84', change: '+4.2%', positive: true,
    marketCap: '$4.8B', fdv: '$5.2B', liquidity: '$220M', volume24h: '$842M',
    riskScore: 12, riskLevel: 'SAFE',
    contract: '0x0000000000000000000000000000000000000002',
    devWallet: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    devActivity: 'Active — last tx 2h ago',
    devHolding: '4.2%',
    holders: '1.2M',
    topHolders: [
      { address: '0xf4a3...9d2e', percent: '8.4%', label: 'Foundation' },
      { address: '0x2b1c...7f3a', percent: '6.1%', label: 'Team' },
      { address: '0x9e8d...4c2b', percent: '3.8%', label: 'Investor' },
      { address: '0x5a4b...1e9f', percent: '2.2%', label: 'Whale' },
      { address: '0x3c2d...8a7e', percent: '1.9%', label: 'Whale' },
    ],
    recentTxns: [
      { hash: '0xab12...ef34', type: 'BUY', amount: '$24,200', time: '1m ago', wallet: '0x4f2a...9c1d' },
      { hash: '0xcd34...gh56', type: 'SELL', amount: '$8,400', time: '3m ago', wallet: '0x8b1c...3e2f' },
      { hash: '0xef56...ij78', type: 'BUY', amount: '$61,000', time: '5m ago', wallet: '0x2d9f...7a4b' },
      { hash: '0xgh78...kl90', type: 'BUY', amount: '$4,800', time: '8m ago', wallet: '0x6e3c...1d8a' },
      { hash: '0xij90...mn12', type: 'SELL', amount: '$17,300', time: '11m ago', wallet: '0x9a7b...4f2c' },
    ],
    chart: [
      { time: '00:00', price: 1.62 }, { time: '04:00', price: 1.58 },
      { time: '08:00', price: 1.71 }, { time: '12:00', price: 1.79 },
      { time: '16:00', price: 1.75 }, { time: '20:00', price: 1.81 },
      { time: '23:59', price: 1.84 },
    ],
    buyPressure: 68,
  },
  BLUB: {
    name: 'Blub', symbol: 'BLUB', price: '$0.0042', change: '+12.3%', positive: true,
    marketCap: '$76M', fdv: '$95M', liquidity: '$4.2M', volume24h: '$41M',
    riskScore: 72, riskLevel: 'HIGH',
    contract: '0x3f7a9c2d1e8b4f6a5c3d2e1f9a8b7c6d5e4f3a2b',
    devWallet: '0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d',
    devActivity: 'Suspicious — large sell 4h ago',
    devHolding: '18.7%',
    holders: '42K',
    topHolders: [
      { address: '0x9c8d...1c0d', percent: '18.7%', label: 'Dev Wallet ⚠️' },
      { address: '0x4f3a...9b2c', percent: '11.2%', label: 'Whale' },
      { address: '0x2e1d...8a7b', percent: '7.4%', label: 'Whale' },
      { address: '0x6c5b...3f2e', percent: '4.1%', label: 'Investor' },
      { address: '0x8a7b...5d4c', percent: '3.2%', label: 'Whale' },
    ],
    recentTxns: [
      { hash: '0xbc23...de45', type: 'SELL', amount: '$142,000', time: '4h ago', wallet: '0x9c8d...1c0d' },
      { hash: '0xde45...fg67', type: 'BUY', amount: '$3,200', time: '4h ago', wallet: '0x4f3a...9b2c' },
      { hash: '0xfg67...hi89', type: 'BUY', amount: '$800', time: '5h ago', wallet: '0x2e1d...8a7b' },
      { hash: '0xhi89...jk01', type: 'SELL', amount: '$5,400', time: '6h ago', wallet: '0x6c5b...3f2e' },
      { hash: '0xjk01...lm23', type: 'BUY', amount: '$1,100', time: '7h ago', wallet: '0x8a7b...5d4c' },
    ],
    chart: [
      { time: '00:00', price: 0.0031 }, { time: '04:00', price: 0.0028 },
      { time: '08:00', price: 0.0035 }, { time: '12:00', price: 0.0041 },
      { time: '16:00', price: 0.0038 }, { time: '20:00', price: 0.0044 },
      { time: '23:59', price: 0.0042 },
    ],
    buyPressure: 41,
  },
}

const fallbackToken = (symbol) => ({
  name: symbol, symbol, price: '$0.001', change: '+2.1%', positive: true,
  marketCap: '$10M', fdv: '$15M', liquidity: '$500K', volume24h: '$2M',
  riskScore: 45, riskLevel: 'MEDIUM',
  contract: '0x1234...abcd', devWallet: '0x5678...efgh',
  devActivity: 'Moderate activity', devHolding: '9.1%', holders: '8K',
  topHolders: [
    { address: '0x1234...5678', percent: '9.1%', label: 'Dev Wallet' },
    { address: '0xabcd...efgh', percent: '5.4%', label: 'Whale' },
  ],
  recentTxns: [
    { hash: '0xabc1...def2', type: 'BUY', amount: '$1,200', time: '2m ago', wallet: '0x1234...5678' },
    { hash: '0xdef3...ghi4', type: 'SELL', amount: '$800', time: '6m ago', wallet: '0xabcd...efgh' },
  ],
  chart: [
    { time: '00:00', price: 0.0009 }, { time: '08:00', price: 0.0010 },
    { time: '16:00', price: 0.0011 }, { time: '23:59', price: 0.0010 },
  ],
  buyPressure: 55,
})

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

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: 'rgba(11,28,44,0.97)',
          border: '1px solid rgba(77,162,255,0.2)',
        }}>
        <p style={{ color: '#6FE3FF' }}>{label}</p>
        <p style={{ color: '#F8FAFC' }}>${payload[0].value}</p>
      </div>
    )
  }
  return null
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
        <code
          className="text-sm px-3 py-2 rounded-lg flex-1 truncate"
          style={{
            background: 'rgba(77,162,255,0.06)',
            color: '#6FE3FF',
            border: '1px solid rgba(77,162,255,0.1)',
          }}
        >
          {value}
        </code>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="p-2 rounded-lg transition-all duration-200"
          style={{
            background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(77,162,255,0.08)',
            border: copied ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(77,162,255,0.15)',
            color: copied ? '#4ade80' : '#4DA2FF',
          }}
          title="Copy to clipboard"
        >
          {copied
            ? <Check className="w-4 h-4" />
            : <Copy className="w-4 h-4" />
          }
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.open(`https://suivision.xyz/account/${value}`, '_blank')}
          className="p-2 rounded-lg transition-all duration-200"
          style={{
            background: 'rgba(77,162,255,0.08)',
            border: '1px solid rgba(77,162,255,0.15)',
            color: '#4DA2FF',
          }}
          title="View on SuiVision"
        >
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

export default function TokenDetail() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const token = tokenData[symbol] || fallbackToken(symbol)
  const risk = riskColor(token.riskLevel)

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto" style={{ color: '#F8FAFC' }}>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-8 transition-colors duration-200"
        style={{ color: '#4DA2FF' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </motion.button>

      {/* Token Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black"
            style={{ background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)', color: '#0B1C2C' }}>
            {token.symbol[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#F8FAFC' }}>{token.symbol}</h1>
            <p style={{ color: '#4DA2FF77' }}>{token.name}</p>
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
            <p className="text-xl font-bold" style={{ color: '#F8FAFC' }}>{m.value}</p>
            <p className="text-xs" style={{ color: '#4DA2FF66' }}>{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Price Chart + Buy/Sell Pressure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard delay={0.1} className="md:col-span-2">
          <h3 className="text-lg font-bold mb-1" style={{ color: '#F8FAFC' }}>Price Chart</h3>
          <p className="text-xs mb-5" style={{ color: '#4DA2FF66' }}>24h price movement</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={token.chart}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={token.positive ? '#4DA2FF' : '#f87171'} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={token.positive ? '#4DA2FF' : '#f87171'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(77,162,255,0.06)" />
              <XAxis dataKey="time" tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4DA2FF66', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price"
                stroke={token.positive ? '#4DA2FF' : '#f87171'} strokeWidth={2.5}
                fill="url(#priceGrad)"
                dot={false} activeDot={{ r: 5, fill: '#6FE3FF' }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Buy/Sell Pressure */}
        <GlassCard delay={0.15}>
          <h3 className="text-lg font-bold mb-1" style={{ color: '#F8FAFC' }}>Buy/Sell Pressure</h3>
          <p className="text-xs mb-6" style={{ color: '#4DA2FF66' }}>Last 24 hours</p>

          <div className="flex flex-col items-center gap-6">
            {/* Circle gauge */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(248,113,113,0.2)" strokeWidth="10" />
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#4DA2FF" strokeWidth="10"
                  strokeLinecap="round"
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
              <p className="text-xs text-center" style={{ color: '#4DA2FF66' }}>
                {token.holders} total holders
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Dev Wallet + Contract */}
      <GlassCard delay={0.2} className="mb-8">
        <h3 className="text-lg font-bold mb-5" style={{ color: '#F8FAFC' }}>Dev Wallet & Contract Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            {[
                { label: 'Contract Address', value: token.contract },
                { label: 'Dev Wallet', value: token.devWallet },
                ].map((item) => (
                <CopyRow key={item.label} label={item.label} value={item.value} />
                ))}
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
                <p>Dev holding: <span style={{ color: '#F8FAFC' }}>{token.devHolding}</span></p>
                <p>Dev activity: <span style={{ color: token.devActivity.includes('Suspicious') ? '#f87171' : '#4ade80' }}>{token.devActivity}</span></p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Top Holders + Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">

        {/* Top Holders */}
        <GlassCard delay={0.25}>
          <h3 className="text-lg font-bold mb-5" style={{ color: '#F8FAFC' }}>Top Holders</h3>
          <div className="flex flex-col gap-3">
            {token.topHolders.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs w-5" style={{ color: '#4DA2FF44' }}>{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F8FAFC' }}>{h.address}</p>
                    <p className="text-xs" style={{ color: '#4DA2FF66' }}>{h.label}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: '#6FE3FF' }}>{h.percent}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard delay={0.3}>
          <h3 className="text-lg font-bold mb-5" style={{ color: '#F8FAFC' }}>Recent Transactions</h3>
          <div className="flex flex-col gap-3">
            {token.recentTxns.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ x: 3 }}
                className="flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 transition-colors duration-150"
                style={{ background: 'rgba(77,162,255,0.03)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: tx.type === 'BUY' ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
                      color: tx.type === 'BUY' ? '#4ade80' : '#f87171',
                      border: `1px solid ${tx.type === 'BUY' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
                    }}>
                    {tx.type}
                  </span>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#F8FAFC' }}>{tx.amount}</p>
                    <p className="text-xs" style={{ color: '#4DA2FF55' }}>{tx.wallet}</p>
                  </div>
                </div>
                <span className="text-xs" style={{ color: '#4DA2FF44' }}>{tx.time}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}