import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  SearchIcon, Wallet, FileCode, ArrowRightLeft,
  AlertTriangle, Shield, ChevronRight, Loader, ExternalLink
} from 'lucide-react'

const riskColor = (level) => {
  if (level === 'DANGER' || level === 'RUG') return { color: '#FF4444', bg: 'rgba(255,68,68,0.1)', border: 'rgba(255,68,68,0.25)' }
  if (level === 'HIGH') return { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' }
  if (level === 'MEDIUM') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)' }
  if (level === 'UNKNOWN') return { color: '#4DA2FF', bg: 'rgba(77,162,255,0.1)', border: 'rgba(77,162,255,0.25)' }
  return { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' }
}

function Detail({ label, value, color }) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: '#4DA2FF55' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: color || '#F8FAFC' }}>{value || 'N/A'}</p>
    </div>
  )
}

function ResultCard({ result, onAnalyze, onTokenDetail }) {
  const rc = riskColor(result.riskLevel)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(13,31,45,0.9), rgba(11,28,44,0.95))',
        border: `1px solid ${rc.border}`,
        boxShadow: `0 0 30px ${rc.color}15`,
      }}
    >
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(77,162,255,0.08)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
            style={{ background: rc.bg, border: `1px solid ${rc.border}` }}>
            {result.imageUrl
              ? <img src={result.imageUrl} alt={result.symbol} className="w-10 h-10 object-contain rounded-full" onError={(e) => e.target.style.display = 'none'} />
              : result.type === 'wallet'
              ? <Wallet className="w-6 h-6" style={{ color: rc.color }} />
              : result.type === 'token'
              ? <FileCode className="w-6 h-6" style={{ color: rc.color }} />
              : <ArrowRightLeft className="w-6 h-6" style={{ color: rc.color }} />
            }
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                style={{ background: 'rgba(77,162,255,0.08)', color: '#4DA2FF' }}>
                {result.type === 'wallet' ? 'Wallet Address' : result.type}
              </span>
              {result.flagged && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                  <AlertTriangle className="w-3 h-3" /> FLAGGED
                </span>
              )}
            </div>
            <p className="text-lg font-black mt-1" style={{ color: '#F8FAFC' }}>
              {result.type === 'wallet'
                ? `${result.address?.slice(0, 6)}...${result.address?.slice(-4)}`
                : result.symbol || result.name || result.label || result.hash}
            </p>
            <p className="text-xs font-mono mt-0.5 break-all" style={{ color: '#4DA2FF55' }}>
              {result.address || result.hash}
            </p>
          </div>
        </div>

        {result.riskScore > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0"
            style={{ background: rc.bg, border: `2px solid ${rc.border}` }}
          >
            <p className="text-xl font-black" style={{ color: rc.color }}>{result.riskScore}</p>
            <p className="text-[9px]" style={{ color: rc.color }}>RISK</p>
          </motion.div>
        )}
      </div>

      {/* Details */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {result.type === 'wallet' && <>
          <Detail label="Total Transactions" value={result.totalTxns} />
          <Detail label="Tokens Created" value={result.tokensCreated} />
          <Detail label="Total Volume" value={result.totalVolume} />
          <Detail label="Last Active" value={result.lastActive} />
        </>}
        {result.type === 'token' && <>
          <Detail label="Price" value={result.price} />
          <Detail label="Market Cap" value={result.marketCap} />
          <Detail label="Volume (24h)" value={result.volume24h} />
          <Detail label="Liquidity" value={result.liquidity} />
        </>}
        {result.type === 'transaction' && <>
          <Detail label="Type" value={result.type_label} />
          <Detail label="Amount" value={result.amount} />
          <Detail label="From" value={result.from} />
          <Detail label="Time" value={result.time} />
        </>}
      </div>

      {/* Flag reason */}
      {result.flagReason && (
        <div className="px-6 py-3 flex items-center gap-2"
          style={{ background: 'rgba(255,68,68,0.05)', borderTop: '1px solid rgba(255,68,68,0.1)' }}>
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs" style={{ color: '#f87171' }}>{result.flagReason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 flex gap-3 flex-wrap"
        style={{ borderTop: '1px solid rgba(77,162,255,0.08)' }}>

        {result.type !== 'wallet' && (
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(77,162,255,0.3)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onAnalyze}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
              color: '#0B1C2C',
            }}
          >
            Full Analysis <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}

        {result.type === 'token' && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onTokenDetail}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: 'rgba(77,162,255,0.08)',
              border: '1px solid rgba(77,162,255,0.2)',
              color: '#4DA2FF',
            }}
          >
            Token Detail <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}

        {result.pairUrl && (
          <motion.a
            href={result.pairUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: 'rgba(77,162,255,0.08)',
              border: '1px solid rgba(77,162,255,0.2)',
              color: '#4DA2FF',
            }}
          >
            View on DexScreener <ExternalLink className="w-4 h-4" />
          </motion.a>
        )}

        {result.suiscanUrl && (
          <motion.a
            href={result.suiscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: 'rgba(77,162,255,0.08)',
              border: '1px solid rgba(77,162,255,0.2)',
              color: '#4DA2FF',
            }}
          >
            View on SuiScan <ExternalLink className="w-4 h-4" />
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  const runSearch = (q) => {
    setLoading(true)
    setSearched(true)
    setResult(null)

    const trimmed = q.trim()
    const isAddress = trimmed.startsWith('0x')
    const API = import.meta.env.VITE_API_URL || 'https://sui-rug-intel-backend.onrender.com'

    if (isAddress) {
      // Try DexScreener first — if found it's a token, if not it's a wallet
      fetch(`${API}/api/dex/tokens/${encodeURIComponent(trimmed)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data) {
            const t = data.data
            setResult({
              type: 'token',
              address: t.address,
              symbol: t.symbol,
              name: t.name,
              riskLevel: t.liquidityRaw < 10000 ? 'HIGH' : t.liquidityRaw < 50000 ? 'MEDIUM' : 'SAFE',
              riskScore: t.liquidityRaw < 10000 ? 78 : t.liquidityRaw < 50000 ? 45 : 20,
              price: t.price,
              marketCap: t.marketCap,
              volume24h: t.volume24h,
              liquidity: t.liquidity,
              status: t.liquidityRaw < 5000 ? 'SUSPICIOUS' : 'ACTIVE',
              flagged: t.liquidityRaw < 10000,
              flagReason: t.liquidityRaw < 10000 ? 'Low liquidity — potential rug risk' : null,
              imageUrl: t.imageUrl,
              pairUrl: t.url,
              suiscanUrl: `https://suiscan.xyz/mainnet/coin/${trimmed}`,
            })
          } else {
            // Not a token — treat as wallet
            setResult({
              type: 'wallet',
              address: trimmed,
              label: 'Wallet Address',
              riskLevel: 'UNKNOWN',
              riskScore: 0,
              flagged: false,
              totalTxns: 'N/A',
              tokensCreated: 'N/A',
              totalVolume: 'N/A',
              lastActive: 'Check SuiScan',
              flagReason: null,
              suiscanUrl: `https://suiscan.xyz/mainnet/account/${trimmed}`,
            })
          }
          setLoading(false)
        })
        .catch(() => { setLoading(false); setResult(null) })

    } else {
      // Search by name/symbol
      fetch(`${API}/api/dex/search?q=${encodeURIComponent(trimmed)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data && data.data.length > 0) {
            // Find exact symbol match first, otherwise highest volume
            const sorted = [...data.data].sort((a, b) => {
              const aVol = parseFloat(a.volume24h?.replace(/[^0-9.]/g, '') || 0)
              const bVol = parseFloat(b.volume24h?.replace(/[^0-9.]/g, '') || 0)
              return bVol - aVol
            })
            const exact = sorted.find(t => t.symbol.toUpperCase() === trimmed.toUpperCase())
            const t = exact || sorted[0]
            setResult({
              type: 'token',
              address: t.address,
              symbol: t.symbol,
              name: t.name,
              riskLevel: t.liquidityRaw < 10000 ? 'HIGH' : t.liquidityRaw < 50000 ? 'MEDIUM' : 'SAFE',
              riskScore: t.liquidityRaw < 10000 ? 78 : t.liquidityRaw < 50000 ? 45 : 20,
              price: t.price,
              marketCap: t.marketCap,
              volume24h: t.volume24h,
              liquidity: t.liquidity,
              status: t.liquidityRaw < 5000 ? 'SUSPICIOUS' : 'ACTIVE',
              flagged: t.liquidityRaw < 10000,
              flagReason: t.liquidityRaw < 10000 ? 'Low liquidity — potential rug risk' : null,
              imageUrl: t.imageUrl,
              pairUrl: t.url,
              suiscanUrl: `https://suiscan.xyz/mainnet/coin/${t.address}`,
            })
          } else {
            setResult(null)
          }
          setLoading(false)
        })
        .catch(() => { setLoading(false); setResult(null) })
    }
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (!q) return
    const timer = setTimeout(() => {
      setInputVal(q)
      runSearch(q)
    }, 0)
    return () => clearTimeout(timer)
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`)
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto" style={{ color: '#F8FAFC' }}>

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-2" style={{
          background: 'linear-gradient(135deg, #F8FAFC, #4DA2FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Search Results
        </h1>
        <p className="text-sm" style={{ color: '#4DA2FF77' }}>
          Search any wallet address, token contract, or token name on SUI
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-10"
        style={{
          background: 'rgba(13,31,45,0.9)',
          border: '1px solid rgba(77,162,255,0.2)',
        }}
      >
        <SearchIcon className="w-5 h-5 shrink-0" style={{ color: '#4DA2FF' }} />
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && inputVal.trim()) navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`) }}
          placeholder="Wallet address, contract address, or token name..."
          className="bg-transparent outline-none text-sm w-full"
          style={{ color: '#F8FAFC' }}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="shrink-0 px-5 py-2 rounded-lg text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #4DA2FF, #6FE3FF)',
            color: '#0B1C2C',
          }}
        >
          Search
        </motion.button>
      </motion.form>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-20"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader className="w-10 h-10" style={{ color: '#4DA2FF' }} />
          </motion.div>
          <p className="text-sm" style={{ color: '#4DA2FF77' }}>
            Scanning the SUI blockchain...
          </p>
          <div className="flex gap-2 flex-wrap justify-center mt-2">
            {['Checking contract...', 'Scanning wallet history...', 'Running risk analysis...'].map((step, i) => (
              <motion.span
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.4 }}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(77,162,255,0.08)',
                  border: '1px solid rgba(77,162,255,0.15)',
                  color: '#4DA2FF88',
                }}
              >
                {step}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {!loading && result && (
        <ResultCard
          result={result}
          onAnalyze={() => navigate(`/analyze/${result.address || result.hash}`)}
          onTokenDetail={() => navigate(`/token/${result.address}`)}
        />
      )}

      {!loading && searched && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
          style={{ color: '#4DA2FF44' }}
        >
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Nothing found for this query</p>
          <p className="text-sm mt-2">Try a wallet address, contract address, or token name</p>
        </motion.div>
      )}

      {!loading && !searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
          style={{ color: '#4DA2FF44' }}
        >
          <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Enter an address or token name to begin</p>
          <p className="text-sm mt-2">Supports wallet addresses, contract addresses, and token names</p>
        </motion.div>
      )}
    </div>
  )
}
