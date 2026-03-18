import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  ArrowLeft, Shield, AlertTriangle, CheckCircle,
  XCircle, Wallet, Users, Flame, ExternalLink, Copy
} from 'lucide-react'

const mockAnalysis = {
  address: '0x4f2a...9c1d',
  symbol: 'MOONCAT',
  name: 'Moon Cat Finance',
  riskScore: 94,
  verdict: 'RUG RISK',
  price: '$0.000001',
  marketCap: '$0',
  liquidity: '$0',
  volume24h: '$0',
  holders: '4,821',
  devWallet: '0x1a2b...3c4d',
  devHolding: '31.2%',
  createdAt: 'Mar 6, 2026',
  checks: [
    { label: 'Mint Authority Disabled', passed: false, info: 'Dev can still mint unlimited tokens' },
    { label: 'Liquidity Locked', passed: false, info: 'No liquidity lock detected' },
    { label: 'Ownership Renounced', passed: false, info: 'Contract owner is still active' },
    { label: 'Honeypot Check', passed: false, info: 'Sell restrictions detected in contract' },
    { label: 'Top 10 Holders < 30%', passed: false, info: 'Top 10 holders control 67% of supply' },
    { label: 'Contract Verified', passed: false, info: 'Source code not verified on-chain' },
    { label: 'Liquidity > $50K', passed: false, info: 'Liquidity fully drained' },
    { label: 'No Freeze Authority', passed: true, info: 'Freeze authority is disabled' },
  ],
  topHolders: [
    { address: '0x1a2b...3c4d', percent: '31.2%', label: 'Dev Wallet ⚠️' },
    { address: '0x5e6f...7g8h', percent: '12.4%', label: 'Whale' },
    { address: '0x9i0j...1k2l', percent: '8.1%', label: 'Whale' },
    { address: '0x3m4n...5o6p', percent: '6.7%', label: 'Investor' },
    { address: '0x7q8r...9s0t', percent: '4.2%', label: 'Whale' },
  ],
  recentTxns: [
    { type: 'REMOVE_LIQ', amount: '$842K', wallet: '0x1a2b...3c4d', time: '1d ago', flagged: true },
    { type: 'SELL', amount: '$124K', wallet: '0x1a2b...3c4d', time: '1d ago', flagged: true },
    { type: 'SELL', amount: '$88K', wallet: '0x5e6f...7g8h', time: '1d ago', flagged: false },
    { type: 'BUY', amount: '$1,200', wallet: '0x9i0j...1k2l', time: '2d ago', flagged: false },
    { type: 'BUY', amount: '$3,400', wallet: '0x3m4n...5o6p', time: '2d ago', flagged: false },
  ],
}

function CheckItem({ check, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{
        background: check.passed ? 'rgba(74,222,128,0.04)' : 'rgba(255,68,68,0.04)',
        border: `1px solid ${check.passed ? 'rgba(74,222,128,0.15)' : 'rgba(255,68,68,0.15)'}`,
      }}
    >
      <div className="flex items-center gap-3">
        {check.passed
          ? <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#4ade80' }} />
          : <XCircle className="w-5 h-5 shrink-0" style={{ color: '#FF4444' }} />
        }
        <div>
          <p className="text-sm font-semibold" style={{ color: '#F8FAFC' }}>{check.label}</p>
          <p className="text-xs mt-0.5" style={{ color: '#4DA2FF66' }}>{check.info}</p>
        </div>
      </div>
      <span className="text-xs font-bold px-2 py-1 rounded-full"
        style={{
          background: check.passed ? 'rgba(74,222,128,0.1)' : 'rgba(255,68,68,0.1)',
          color: check.passed ? '#4ade80' : '#FF4444',
        }}>
        {check.passed ? 'PASS' : 'FAIL'}
      </span>
    </motion.div>
  )
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

export default function Analyze() {
  const { address: paramAddress } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const data = mockAnalysis
  const passedChecks = data.checks.filter((c) => c.passed).length
  const totalChecks = data.checks.length

  const handleCopy = (val) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto" style={{ color: '#F8FAFC', background: '#0B1C2C' }}>

      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-8"
        style={{ color: '#4DA2FF' }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </motion.button>

      {/* Verdict Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,68,68,0.08), rgba(11,28,44,0.95))',
          border: '1px solid rgba(255,68,68,0.25)',
          boxShadow: '0 0 60px rgba(255,68,68,0.08)',
        }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,68,68,0.06), transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Risk Score Circle */}
          <div className="relative shrink-0">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none"
                stroke="rgba(255,68,68,0.1)" strokeWidth="8" />
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF4444" />
                  <stop offset="100%" stopColor="#FF8888" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#riskGrad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - data.riskScore / 100) }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="text-4xl font-black"
                style={{ color: '#FF4444' }}
              >
                {data.riskScore}
              </motion.p>
              <p className="text-xs font-bold" style={{ color: '#FF444488' }}>RISK SCORE</p>
            </div>
          </div>

          {/* Verdict Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-3xl"
              >
                ⚠️
              </motion.span>
              <h1 className="text-4xl font-black" style={{ color: '#FF4444' }}>
                {data.verdict}
              </h1>
            </div>
            <p className="text-xl font-bold mb-1" style={{ color: '#F8FAFC' }}>
              {data.symbol} — {data.name}
            </p>
            <p className="text-sm font-mono mb-4" style={{ color: '#4DA2FF55' }}>
              {paramAddress || data.address}
            </p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <CheckCircle className="w-4 h-4" style={{ color: '#4ade80' }} />
                <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{passedChecks} Passed</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}>
                <XCircle className="w-4 h-4" style={{ color: '#FF4444' }} />
                <span className="text-sm font-bold" style={{ color: '#FF4444' }}>{totalChecks - passedChecks} Failed</span>
              </div>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { label: 'Liquidity', value: data.liquidity },
              { label: 'Holders', value: data.holders },
              { label: 'Dev Holding', value: data.devHolding },
              { label: 'Created', value: data.createdAt },
            ].map((s) => (
              <div key={s.label} className="px-4 py-3 rounded-xl text-center"
                style={{ background: 'rgba(77,162,255,0.06)', border: '1px solid rgba(77,162,255,0.1)' }}>
                <p className="text-sm font-bold" style={{ color: '#F8FAFC' }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#4DA2FF66' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Security Checks */}
      <GlassCard delay={0.1} className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5" style={{ color: '#4DA2FF' }} />
          <h2 className="text-lg font-bold" style={{ color: '#F8FAFC' }}>Security Checks</h2>
          <span className="ml-auto text-xs px-2 py-1 rounded-full"
            style={{ background: 'rgba(255,68,68,0.1)', color: '#FF4444', border: '1px solid rgba(255,68,68,0.2)' }}>
            {passedChecks}/{totalChecks} passed
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.checks.map((check, i) => (
            <CheckItem key={check.label} check={check} index={i} />
          ))}
        </div>
      </GlassCard>

      {/* Dev Wallet + Contract */}
      <GlassCard delay={0.2} className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Wallet className="w-5 h-5" style={{ color: '#4DA2FF' }} />
          <h2 className="text-lg font-bold" style={{ color: '#F8FAFC' }}>Dev Wallet & Contract</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Contract Address', value: data.address },
            { label: 'Dev Wallet', value: data.devWallet },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs mb-2 uppercase tracking-wider" style={{ color: '#4DA2FF66' }}>{item.label}</p>
              <div className="flex items-center gap-2">
                <code className="text-sm px-3 py-2 rounded-lg flex-1 truncate"
                  style={{ background: 'rgba(77,162,255,0.06)', color: '#6FE3FF', border: '1px solid rgba(77,162,255,0.1)' }}>
                  {item.value}
                </code>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopy(item.value)}
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(77,162,255,0.08)', color: copied ? '#4ade80' : '#4DA2FF' }}
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.open(`https://suivision.xyz/account/${item.value}`, '_blank')}
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(77,162,255,0.08)', color: '#4DA2FF' }}
                >
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Top Holders + Recent Txns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <GlassCard delay={0.3}>
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5" style={{ color: '#4DA2FF' }} />
            <h2 className="text-lg font-bold" style={{ color: '#F8FAFC' }}>Top Holders</h2>
          </div>
          <div className="flex flex-col gap-3">
            {data.topHolders.map((h, i) => (
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
                    <p className="text-sm font-mono" style={{ color: '#F8FAFC' }}>{h.address}</p>
                    <p className="text-xs" style={{ color: h.label.includes('Dev') ? '#FF4444' : '#4DA2FF66' }}>{h.label}</p>
                  </div>
                </div>
                <span className="text-sm font-bold"
                  style={{ color: h.label.includes('Dev') ? '#FF4444' : '#6FE3FF' }}>
                  {h.percent}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.35}>
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-5 h-5" style={{ color: '#4DA2FF' }} />
            <h2 className="text-lg font-bold" style={{ color: '#F8FAFC' }}>Recent Transactions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {data.recentTxns.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{
                  background: tx.flagged ? 'rgba(255,68,68,0.04)' : 'rgba(77,162,255,0.03)',
                  border: `1px solid ${tx.flagged ? 'rgba(255,68,68,0.15)' : 'rgba(77,162,255,0.08)'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: tx.type === 'BUY' ? 'rgba(74,222,128,0.12)'
                        : tx.type === 'REMOVE_LIQ' ? 'rgba(255,68,68,0.15)'
                        : 'rgba(249,115,22,0.12)',
                      color: tx.type === 'BUY' ? '#4ade80'
                        : tx.type === 'REMOVE_LIQ' ? '#FF4444'
                        : '#f97316',
                    }}>
                    {tx.type}
                  </span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#F8FAFC' }}>{tx.amount}</p>
                    <p className="text-xs" style={{ color: '#4DA2FF55' }}>{tx.wallet}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tx.flagged && <AlertTriangle className="w-3 h-3 text-red-400" />}
                  <span className="text-xs" style={{ color: '#4DA2FF44' }}>{tx.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}