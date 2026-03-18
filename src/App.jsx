import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import RugAlerts from './pages/RugAlerts'
import RugCemetery from './pages/RugCemetery'
import Leaderboard from './pages/Leaderboard'
import TokenDetail from './pages/TokenDetail'
import SearchPage from './pages/Search'
import Analyze from './pages/Analyze'

function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: '#0B1C2C', color: '#F8FAFC' }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rug-alerts" element={<RugAlerts />} />
        <Route path="/rug-cemetery" element={<RugCemetery />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/token/:symbol" element={<TokenDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/analyze/:address" element={<Analyze />} />
      </Routes>
    </div>
  )
}

export default App