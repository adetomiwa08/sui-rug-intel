import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Explorer', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Rug Alerts', path: '/rug-alerts' },
    { label: 'Rug Cemetery', path: '/rug-cemetery' },
    { label: 'Leaderboard', path: '/leaderboard' },
  ]

  return (
    <nav
      className="w-full sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{
        background: 'rgba(11,28,44,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(77,162,255,0.12)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
       <motion.div
  whileHover={{ rotate: 15, scale: 1.1 }}
  transition={{ type: 'spring', stiffness: 300 }}
  className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
>
  <img
    src="/src/assets/logo.png"
    alt="SUI RUG INTEL"
    className="w-10 h-10 object-contain"
    style={{ mixBlendMode: 'screen' }}
  />
</motion.div>
        <span className="font-bold text-lg tracking-wide" style={{ color: '#F8FAFC' }}>
          SUI{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF4444, #FF8888)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            RUG
          </span>{' '}
          <span className="sui-text">INTEL</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            <motion.div
              whileHover={{ y: -1 }}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: location.pathname === link.path ? '#6FE3FF' : '#4DA2FF88',
                background: location.pathname === link.path ? 'rgba(77,162,255,0.08)' : 'transparent',
              }}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #4DA2FF, #6FE3FF)' }}
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Mobile menu button */}
      <div className="flex items-center md:hidden">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(77,162,255,0.08)', color: '#4DA2FF' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 w-full px-6 py-4 flex flex-col gap-1 md:hidden"
            style={{
              background: 'rgba(11,28,44,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(77,162,255,0.12)',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{
                  color: location.pathname === link.path ? '#6FE3FF' : '#4DA2FF88',
                  background: location.pathname === link.path ? 'rgba(77,162,255,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}