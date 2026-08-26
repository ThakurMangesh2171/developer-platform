import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = 'login' | 'signup' | 'forgot' | 'forgot-sent' | 'dashboard' | 'project' | 'service'
type ProjectTab = 'overview' | 'services' | 'settings'
type ServiceTab = 'overview' | 'apikeys'

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES_MAP: Record<number, { id: number; name: string; type: string; status: string; requests: string; uptime: string }[]> = {
  1: [
    { id: 101, name: 'URL Shortener', type: 'url-shortener', status: 'Active', requests: '48.2K', uptime: '99.98%' },
    { id: 102, name: 'Auth Gateway', type: 'auth', status: 'Active', requests: '12.1K', uptime: '100%' },
    { id: 103, name: 'Image CDN', type: 'cdn', status: 'Inactive', requests: '0', uptime: '—' },
  ],
  2: [
    { id: 201, name: 'URL Shortener', type: 'url-shortener', status: 'Active', requests: '9.4K', uptime: '99.9%' },
  ],
  3: [],
  4: [
    { id: 401, name: 'Event Tracker', type: 'analytics', status: 'Active', requests: '201K', uptime: '99.95%' },
    { id: 402, name: 'Report Export', type: 'analytics', status: 'Active', requests: '3.2K', uptime: '99.8%' },
  ],
  5: [
    { id: 501, name: 'Webhook Relay', type: 'webhook', status: 'Active', requests: '22K', uptime: '99.99%' },
    { id: 502, name: 'Retry Queue', type: 'webhook', status: 'Active', requests: '1.1K', uptime: '100%' },
  ],
  6: [],
}

const PROJECTS = [
  { id: 1, name: 'Production API', status: 'Active', updated: '2 hours ago' },
  { id: 2, name: 'URL Shortener', status: 'Active', updated: '1 day ago' },
  { id: 3, name: 'Auth Service', status: 'Inactive', updated: '5 days ago' },
  { id: 4, name: 'Analytics Engine', status: 'Active', updated: '3 hours ago' },
  { id: 5, name: 'Webhook Proxy', status: 'Active', updated: '12 hours ago' },
  { id: 6, name: 'Image CDN', status: 'Inactive', updated: '2 weeks ago' },
]

const API_KEYS_MAP: Record<number, { id: number; name: string; key: string; created: string; lastUsed: string }[]> = {
  101: [
    { id: 1, name: 'Production Key', key: 'sk_live_4xK9mP2qR7vT', created: 'Jul 28, 2026', lastUsed: '2 hours ago' },
    { id: 2, name: 'CI/CD Pipeline', key: 'sk_live_8nB3dF6wY1uA', created: 'Jul 15, 2026', lastUsed: '1 day ago' },
  ],
  102: [
    { id: 3, name: 'Staging Key', key: 'sk_test_2cH5jL9oE4sX', created: 'Jun 30, 2026', lastUsed: '5 days ago' },
  ],
  201: [
    { id: 4, name: 'Read-only Audit', key: 'sk_live_7mN1pQ8rW0iZ', created: 'Jun 10, 2026', lastUsed: '1 week ago' },
    { id: 5, name: 'Main Key', key: 'sk_live_3pT8rK5nW2qB', created: 'Jul 20, 2026', lastUsed: '3 hours ago' },
  ],
}

const SHORT_LINKS = [
  { id: 1, short: 'lnk.dev/x9K2p', original: 'https://github.com/acmecorp/production-api/releases/v2.4.0', clicks: 1842, created: 'Jul 30, 2026' },
  { id: 2, short: 'lnk.dev/m7Rqw', original: 'https://docs.acmecorp.io/api/getting-started', clicks: 934, created: 'Jul 28, 2026' },
  { id: 3, short: 'lnk.dev/b3Yht', original: 'https://acmecorp.io/blog/announcing-v2', clicks: 5217, created: 'Jul 22, 2026' },
  { id: 4, short: 'lnk.dev/c8Nxv', original: 'https://dashboard.acmecorp.io/onboarding', clicks: 421, created: 'Jul 18, 2026' },
  { id: 5, short: 'lnk.dev/f1Jqm', original: 'https://acmecorp.io/pricing', clicks: 2103, created: 'Jul 10, 2026' },
]

const CLICK_DATA = [
  { day: 'Mon', clicks: 312 },
  { day: 'Tue', clicks: 487 },
  { day: 'Wed', clicks: 394 },
  { day: 'Thu', clicks: 621 },
  { day: 'Fri', clicks: 558 },
  { day: 'Sat', clicks: 203 },
  { day: 'Sun', clicks: 279 },
]

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Grid: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Folder: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  Link: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
  ),
}

// ─── Shared Components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const active = status === 'Active'
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs mono ${
      active
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'bg-white/5 text-white/40 border border-white/10'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-white/30'}`} />
      {status}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ screen, setScreen, onLogout }: {
  screen: Screen
  setScreen: (s: Screen) => void
  onLogout: () => void
}) {
  const [profileOpen, setProfileOpen] = useState(false)

  const navItems = [
    { id: 'dashboard' as Screen, label: 'Overview', Icon: Icon.Grid },
    { id: 'project' as Screen, label: 'Projects', Icon: Icon.Folder },
    { id: 'dashboard' as Screen, label: 'Settings', Icon: Icon.Settings },
  ]

  return (
    <aside className="flex flex-col w-56 shrink-0 h-screen border-r border-white/[0.06] bg-[#0D0D0D] relative">
      {/* Logo + Workspace */}
      <div className="px-4 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center purple-glow-btn">
            <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path d="M10 2L3 7v11h14V7L10 2zm0 2.2l5 3.5V16H5V7.7l5-3.5z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight">devhub</span>
        </div>
        <button className="w-full glass rounded-lg px-3 py-2 flex items-center justify-between text-sm hover:border-purple-500/30 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500/40 shrink-0 flex items-center justify-center">
              <span className="text-[8px] text-purple-300 font-bold">A</span>
            </div>
            <span className="text-white/80 truncate">Acme Corp</span>
          </div>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white/30 shrink-0">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="text-[10px] text-white/20 mono px-3 mb-2 tracking-widest">WORKSPACE</p>
        {navItems.map((item, i) => {
          const isActive =
            (item.label === 'Overview' && screen === 'dashboard') ||
            (item.label === 'Projects' && (screen === 'project' || screen === 'service'))
          return (
            <button
              key={i}
              onClick={() => setScreen(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                isActive
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <item.Icon />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Profile — single entry, with dropdown */}
      <div className="px-3 py-4 border-t border-white/[0.06] relative">
        <button
          onClick={() => setProfileOpen(o => !o)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
            profileOpen ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm text-white/80 truncate">Jordan Davis</div>
            <div className="text-xs text-white/40 truncate">j.davis@acme.io</div>
          </div>
          <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dropdown — opens upward */}
        {profileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 glass-strong rounded-xl overflow-hidden shadow-xl border border-white/10"
            style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.5)' }}>
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                  JD
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">Jordan Davis</div>
                  <div className="text-xs text-white/40 truncate">j.davis@acme.io</div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {[
                { label: 'Profile Settings', icon: '👤' },
                { label: 'Billing & Usage', icon: '💳' },
                { label: 'Notifications', icon: '🔔' },
                { label: 'Keyboard Shortcuts', icon: '⌨️' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-white/[0.06] py-1">
              <button
                onClick={() => { setProfileOpen(false); onLogout() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors text-left"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ crumbs }: { crumbs: string[] }) {
  return (
    <div className="h-14 flex items-center justify-between px-8 border-b border-white/[0.06] shrink-0">
      <div className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <Icon.ChevronRight />}
            <span className={i === crumbs.length - 1 ? 'text-white/80' : 'text-white/35'}>{c}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-white/40">
        <span className="mono text-xs">Aug 3, 2026</span>
      </div>
    </div>
  )
}

// ─── Auth Background ──────────────────────────────────────────────────────────

function AuthBg() {
  return (
    <>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #7C3AED 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #A855F7 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #6D28D9 0%, transparent 70%)', filter: 'blur(50px)' }} />
    </>
  )
}

function AuthLogo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-4 purple-glow">
        <svg viewBox="0 0 20 20" fill="none" stroke="#A855F7" strokeWidth="1.5" className="w-6 h-6">
          <path d="M10 2L3 7v11h14V7L10 2z" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold tracking-tight">devhub</h1>
      <p className="text-sm text-white/40 mt-1">Developer Platform</p>
    </div>
  )
}

function AuthInput({
  label, type = 'text', value, onChange, placeholder, onKeyDown
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <div>
      <label className="text-xs text-white/50 mb-1.5 block mono">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-purple-500/60 focus:bg-white/[0.07] transition-all"
      />
    </div>
  )
}

function PurpleBtn({ onClick, loading, children, disabled }: {
  onClick: () => void
  loading?: boolean
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all purple-glow-btn disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 60" />
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  )
}

// ─── Screen: Login ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, goSignup, goForgot }: {
  onLogin: () => void
  goSignup: () => void
  goForgot: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 900)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      <AuthBg />
      <div className="relative z-10 w-full max-w-sm mx-4">
        <AuthLogo />
        <div className="glass-strong rounded-2xl p-8 purple-glow">
          <h2 className="text-lg font-semibold mb-1">Welcome back</h2>
          <p className="text-sm text-white/40 mb-6">Sign in to your workspace</p>
          <div className="flex flex-col gap-4">
            <AuthInput label="EMAIL" type="email" value={email} onChange={setEmail} placeholder="you@company.io" />
            <AuthInput
              label="PASSWORD" type="password" value={password} onChange={setPassword}
              placeholder="••••••••••••" onKeyDown={e => e.key === 'Enter' && handle()}
            />
            <div className="flex justify-end -mt-1">
              <button onClick={goForgot} className="text-xs text-purple-400/80 hover:text-purple-300 transition-colors">
                Forgot password?
              </button>
            </div>
            <PurpleBtn onClick={handle} loading={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </PurpleBtn>
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <span className="text-sm text-white/40">No account? </span>
            <button onClick={goSignup} className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Create one free
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-white/20 mt-6">Protected by enterprise-grade encryption</p>
      </div>
    </div>
  )
}

// ─── Screen: Sign Up ──────────────────────────────────────────────────────────

function SignupScreen({ goLogin, onSignup }: { goLogin: () => void; onSignup: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const mismatch = confirm.length > 0 && confirm !== password
  const strong = password.length >= 8

  const handle = () => {
    if (!agreed || mismatch || !strong) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onSignup() }, 1000)
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden py-10">
      <AuthBg />
      <div className="relative z-10 w-full max-w-sm mx-4">
        <AuthLogo />
        <div className="glass-strong rounded-2xl p-8 purple-glow">
          <h2 className="text-lg font-semibold mb-1">Create your account</h2>
          <p className="text-sm text-white/40 mb-6">Start building in under a minute</p>

          <div className="flex flex-col gap-4">
            <AuthInput label="FULL NAME" value={name} onChange={setName} placeholder="Jordan Davis" />
            <AuthInput label="WORK EMAIL" type="email" value={email} onChange={setEmail} placeholder="you@company.io" />

            <div>
              <label className="text-xs text-white/50 mb-1.5 block mono">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-purple-500/60 focus:bg-white/[0.07] transition-all"
              />
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        i <= strength
                          ? strength === 1 ? 'bg-red-500' : strength === 2 ? 'bg-amber-400' : 'bg-emerald-400'
                          : 'bg-white/10'
                      }`} />
                    ))}
                  </div>
                  <span className={`text-xs mono ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1.5 block mono">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all ${
                  mismatch ? 'border-red-500/50 focus:border-red-500/70' : 'border-white/10 focus:border-purple-500/60 focus:bg-white/[0.07]'
                }`}
                onKeyDown={e => e.key === 'Enter' && handle()}
              />
              {mismatch && <p className="mt-1.5 text-xs text-red-400 mono">Passwords do not match</p>}
            </div>

            {/* T&C */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(a => !a)}
                className={`mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center transition-all ${
                  agreed ? 'bg-purple-500 border-purple-500' : 'border-white/20 bg-white/[0.04] group-hover:border-purple-500/40'
                }`}
              >
                {agreed && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-white/50 leading-relaxed">
                I agree to the{' '}
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            <PurpleBtn onClick={handle} loading={loading} disabled={!agreed || mismatch || !strong || !name || !email}>
              {loading ? 'Creating account…' : 'Create Account'}
            </PurpleBtn>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <span className="text-sm text-white/40">Already have an account? </span>
            <button onClick={goLogin} className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Sign in
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-white/20 mt-6">Protected by enterprise-grade encryption</p>
      </div>
    </div>
  )
}

// ─── Screen: Forgot Password ──────────────────────────────────────────────────

function ForgotScreen({ goLogin, onSent }: { goLogin: () => void; onSent: () => void }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = () => {
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onSent() }, 900)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      <AuthBg />
      <div className="relative z-10 w-full max-w-sm mx-4">
        <AuthLogo />
        <div className="glass-strong rounded-2xl p-8 purple-glow">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
            <svg viewBox="0 0 20 20" fill="none" stroke="#A855F7" strokeWidth="1.5" className="w-6 h-6">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold mb-1">Reset your password</h2>
          <p className="text-sm text-white/40 mb-6">
            Enter your email and we will send a secure reset link. It expires in 15 minutes.
          </p>

          <div className="flex flex-col gap-4">
            <AuthInput
              label="EMAIL ADDRESS" type="email" value={email} onChange={setEmail}
              placeholder="you@company.io" onKeyDown={e => e.key === 'Enter' && handle()}
            />
            <PurpleBtn onClick={handle} loading={loading}>
              {loading ? 'Sending link…' : 'Send Reset Link'}
            </PurpleBtn>
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <button onClick={goLogin} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mx-auto">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Forgot Password — Sent ──────────────────────────────────────────

function ForgotSentScreen({ goLogin }: { goLogin: () => void }) {
  const [countdown, setCountdown] = useState(60)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (countdown === 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const resend = () => {
    setResent(true)
    setCountdown(60)
    setTimeout(() => setResent(false), 2000)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
      <AuthBg />
      <div className="relative z-10 w-full max-w-sm mx-4">
        <AuthLogo />
        <div className="glass-strong rounded-2xl p-8 purple-glow text-center">
          {/* Animated checkmark */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold mb-2">Check your inbox</h2>
          <p className="text-sm text-white/40 mb-2">
            We sent a reset link to your email. Follow the link to set a new password.
          </p>
          <p className="text-xs text-white/25 mb-8 mono">The link expires in 15 minutes.</p>

          {/* Tips */}
          <div className="glass rounded-xl p-4 text-left mb-6">
            <p className="text-xs text-white/40 mb-2 mono font-medium">DIDN"T RECEIVE IT?</p>
            <ul className="text-xs text-white/35 space-y-1.5">
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">→</span> Check your spam or junk folder</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">→</span> Make sure the email address is correct</li>
              <li className="flex items-start gap-2"><span className="text-purple-400 mt-0.5">→</span> Allow a minute for delivery</li>
            </ul>
          </div>

          <button
            onClick={resend}
            disabled={countdown > 0}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white/80 hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-4"
          >
            {resent ? '✓ Resent!' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend email'}
          </button>

          <button onClick={goLogin} className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mx-auto">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────

function DashboardScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const totalServices = Object.values(SERVICES_MAP).flat().length
  const activeServices = Object.values(SERVICES_MAP).flat().filter(s => s.status === 'Active').length
  const activeProjects = PROJECTS.filter(p => p.status === 'Active').length
  const totalKeys = Object.values(API_KEYS_MAP).flat().length

  return (
    <div className="flex flex-col h-full">
      <Header crumbs={['Acme Corp', 'Overview']} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-7">
          <h2 className="text-xl font-semibold">Good morning, Jordan</h2>
          <p className="text-sm text-white/40 mt-1">Here is what is happening across your workspace.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Projects', value: PROJECTS.length, sub: `${activeProjects} active`, color: 'text-white' },
            { label: 'Services', value: totalServices, sub: `${activeServices} running`, color: 'text-white' },
            { label: 'API Keys', value: totalKeys, sub: 'across all services', color: 'text-white' },
            { label: 'Uptime', value: '99.97%', sub: 'last 30 days', color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-5 hover:border-purple-500/20 transition-colors">
              <div className={`text-2xl font-semibold tracking-tight mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-white/60 mb-1">{stat.label}</div>
              <div className="text-xs text-white/30 mono">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold">Projects</h3>
            <p className="text-sm text-white/40 mt-0.5">Each project groups related services and API keys</p>
          </div>
          <button
            onClick={() => setScreen('project')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white purple-glow-btn transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
          >
            <Icon.Plus />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {PROJECTS.map(proj => {
            const services = SERVICES_MAP[proj.id] || []
            const activeCount = services.filter(s => s.status === 'Active').length
            return (
              <button
                key={proj.id}
                onClick={() => setScreen('project')}
                className="glass rounded-xl p-5 text-left hover:border-purple-500/25 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Icon.Folder />
                  </div>
                  <StatusBadge status={proj.status} />
                </div>
                <h3 className="font-medium text-sm mb-0.5">{proj.name}</h3>
                <p className="text-xs text-white/35 mb-4">Updated {proj.updated}</p>
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <Icon.Chart />
                    <span className="text-xs text-white/50">{services.length} services</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/50">{activeCount} active</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── API Keys Table (shared) ──────────────────────────────────────────────────

function ApiKeysTable({ serviceId }: { serviceId: number }) {
  const initial = API_KEYS_MAP[serviceId] || []
  const [keys, setKeys] = useState(initial)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const toggle = (id: number) => setRevealed(s => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n
  })
  const revoke = (id: number) => setKeys(k => k.filter(x => x.id !== id))
  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const rand = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setKeys(k => [...k, { id: Date.now(), name: `Key ${k.length + 1}`, key: `sk_live_${rand}`, created: 'Aug 3, 2026', lastUsed: 'Just now' }])
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">API Keys</h2>
          <p className="text-sm text-white/40">{keys.length} key{keys.length !== 1 ? 's' : ''} for this service</p>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white purple-glow-btn transition-all"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
        >
          <Icon.Plus />
          Generate Key
        </button>
      </div>
      {keys.length === 0 ? (
        <div className="glass rounded-2xl py-16 text-center text-white/30 text-sm">
          No API keys yet. Generate one to get started.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Key', 'Created', 'Last Used', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-left text-xs text-white/35 mono font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={k.id} className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${i === keys.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4 text-sm font-medium">{k.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="mono text-xs text-white/60 bg-white/[0.05] px-2.5 py-1 rounded-lg">
                        {revealed.has(k.id) ? k.key : k.key.slice(0, 7) + '•'.repeat(8) + k.key.slice(-4)}
                      </span>
                      <button onClick={() => toggle(k.id)} className="text-white/30 hover:text-purple-400 transition-colors"><Icon.Eye /></button>
                      <button className="text-white/30 hover:text-purple-400 transition-colors"><Icon.Copy /></button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/50">{k.created}</td>
                  <td className="px-5 py-4 text-sm text-white/50">{k.lastUsed}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => revoke(k.id)} className="text-white/25 hover:text-red-400 transition-colors"><Icon.Trash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Screen: Project Detail → Services list ───────────────────────────────────

function ProjectScreen({ setScreen, setSelectedService }: {
  setScreen: (s: Screen) => void
  setSelectedService: (id: number) => void
}) {
  const proj = PROJECTS[0] // "Production API" as the active project
  const services = SERVICES_MAP[proj.id] || []
  const [tab, setTab] = useState<ProjectTab>('services')

  const openService = (id: number) => { setSelectedService(id); setScreen('service') }

  return (
    <div className="flex flex-col h-full">
      <Header crumbs={['Acme Corp', 'Projects', proj.name]} />
      <div className="flex-1 overflow-y-auto p-8">
        {/* Project header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="#A855F7" className="w-6 h-6">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold">{proj.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={proj.status} />
              <span className="text-xs text-white/30 mono">proj_4xK9mP2qR7vT</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 glass rounded-xl w-fit">
          {(['overview', 'services', 'settings'] as ProjectTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25' : 'text-white/45 hover:text-white/70'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Requests Today', value: '48,291', change: '+12.4%' },
              { label: 'Avg Response Time', value: '84ms', change: '-3.2%' },
              { label: 'Error Rate', value: '0.12%', change: '-0.04%' },
              { label: 'Uptime (30d)', value: '99.98%', change: 'stable' },
            ].map((m, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <div className="text-2xl font-semibold tracking-tight mb-1">{m.value}</div>
                <div className="text-sm text-white/60">{m.label}</div>
                <div className="text-xs text-emerald-400 mt-1 mono">{m.change}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'services' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold">Services</h2>
                <p className="text-sm text-white/40">Each service has its own API keys and configuration</p>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white purple-glow-btn transition-all"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
              >
                <Icon.Plus />
                Add Service
              </button>
            </div>

            {services.length === 0 ? (
              <div className="glass rounded-2xl py-20 text-center text-white/30 text-sm">
                No services yet. Add your first service to get started.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {services.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => openService(svc.id)}
                    className="glass rounded-xl p-5 text-left hover:border-purple-500/25 hover:bg-white/[0.05] transition-all flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <Icon.Link />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-0.5">
                        <span className="font-medium text-sm">{svc.name}</span>
                        <StatusBadge status={svc.status} />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-white/35 mono">{svc.requests} req today</span>
                        <span className="text-xs text-white/35 mono">{svc.uptime} uptime</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-white/30 mono">{(API_KEYS_MAP[svc.id] || []).length} keys</span>
                      <Icon.ChevronRight />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'settings' && (
          <div className="glass rounded-2xl p-6 text-center py-16 text-white/30 text-sm">
            Project settings coming soon.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Screen: Service Detail → API Keys ───────────────────────────────────────

function ServiceScreen({ serviceId, setScreen }: { serviceId: number; setScreen: (s: Screen) => void }) {
  const services = Object.values(SERVICES_MAP).flat()
  const svc = services.find(s => s.id === serviceId) || services[0]
  const [tab, setTab] = useState<ServiceTab>('apikeys')

  return (
    <div className="flex flex-col h-full">
      <Header crumbs={['Acme Corp', 'Projects', 'Production API', svc.name]} />
      <div className="flex-1 overflow-y-auto p-8">
        {/* Back */}
        <button
          onClick={() => setScreen('project')}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Production API
        </button>

        {/* Service header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Icon.Link />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{svc.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={svc.status} />
              <span className="text-xs text-white/30 mono">svc_{svc.id}</span>
              <span className="text-xs text-white/30 mono">{svc.requests} req today</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 glass rounded-xl w-fit">
          {(['overview', 'apikeys'] as ServiceTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25' : 'text-white/45 hover:text-white/70'
              }`}
            >
              {t === 'apikeys' ? 'API Keys' : 'Overview'}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Requests Today', value: svc.requests },
              { label: 'Uptime (30d)', value: svc.uptime },
              { label: 'Avg Latency', value: '62ms' },
            ].map((m, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <div className="text-2xl font-semibold tracking-tight mb-1">{m.value}</div>
                <div className="text-sm text-white/50">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'apikeys' && <ApiKeysTable serviceId={svc.id} />}
      </div>
    </div>
  )
}

// ─── Screen: URL Shortener ────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="text-white/50 mono">{label}</p>
      <p className="text-purple-300 font-semibold">{payload[0].value.toLocaleString()} clicks</p>
    </div>
  )
}

function URLShortenerScreen() {
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState(SHORT_LINKS)
  const [copied, setCopied] = useState<number | null>(null)

  const shorten = () => {
    if (!url.trim()) return
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const code = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setLinks(l => [{
      id: Date.now(),
      short: `lnk.dev/${code}`,
      original: url.trim(),
      clicks: 0,
      created: 'Aug 3, 2026',
    }, ...l])
    setUrl('')
  }

  const copy = (id: number, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col h-full">
      <Header crumbs={['Acme Corp', 'Projects', 'URL Shortener']} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">URL Shortener</h1>
            <p className="text-sm text-white/40 mt-0.5">Create, track, and manage shortened links</p>
          </div>
          <StatusBadge status="Active" />
        </div>

        {/* Input */}
        <div className="glass rounded-2xl p-5 mb-6">
          <label className="text-xs text-white/40 mono mb-2 block">PASTE LONG URL</label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && shorten()}
              placeholder="https://your-very-long-url.com/with/deep/path?and=params&lots=of&query=strings"
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-purple-500/50 transition-all mono"
            />
            <button
              onClick={shorten}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white shrink-0 purple-glow-btn transition-all"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              Shorten
            </button>
          </div>
        </div>

        {/* Main content: table + chart */}
        <div className="grid grid-cols-[1fr_280px] gap-5">
          {/* Links table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Links</h3>
              <span className="text-xs text-white/35 mono">{links.length} total</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {['Shortened URL', 'Original', 'Clicks', 'Created', ''].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-xs text-white/30 mono font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr key={link.id} className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${i === links.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 text-xs mono font-medium">{link.short}</span>
                        <button
                          onClick={() => copy(link.id, `https://${link.short}`)}
                          className={`transition-colors ${copied === link.id ? 'text-emerald-400' : 'text-white/25 hover:text-purple-400'}`}
                        >
                          <Icon.Copy />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-white/45 truncate block max-w-[200px]">{link.original}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-white/80">{link.clicks.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-white/40">{link.created}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-white/20 hover:text-red-400 transition-colors">
                        <Icon.Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Analytics chart */}
          <div className="glass rounded-2xl p-5 flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">Click Analytics</h3>
              <p className="text-xs text-white/40 mono mt-0.5">Last 7 days</p>
            </div>
            <div className="mb-4">
              <div className="text-2xl font-semibold">
                {CLICK_DATA.reduce((s, d) => s + d.clicks, 0).toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400 mono mt-0.5">+18.3% vs last week</div>
            </div>
            <div className="flex-1 min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CLICK_DATA} barSize={20}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168,85,247,0.06)' }} />
                  <Bar
                    dataKey="clicks"
                    fill="#7C3AED"
                    radius={[4, 4, 0, 0]}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.4))' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [selectedService, setSelectedService] = useState<number>(101)

  const isAuth = screen === 'login' || screen === 'signup' || screen === 'forgot' || screen === 'forgot-sent'

  if (isAuth) {
    if (screen === 'login') return (
      <LoginScreen
        onLogin={() => setScreen('dashboard')}
        goSignup={() => setScreen('signup')}
        goForgot={() => setScreen('forgot')}
      />
    )
    if (screen === 'signup') return (
      <SignupScreen goLogin={() => setScreen('login')} onSignup={() => setScreen('dashboard')} />
    )
    if (screen === 'forgot') return (
      <ForgotScreen goLogin={() => setScreen('login')} onSent={() => setScreen('forgot-sent')} />
    )
    if (screen === 'forgot-sent') return (
      <ForgotSentScreen goLogin={() => setScreen('login')} />
    )
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden">
      <Sidebar screen={screen} setScreen={setScreen} onLogout={() => setScreen('login')} />
      <main className="flex-1 overflow-hidden flex flex-col">
        {screen === 'dashboard' && <DashboardScreen setScreen={setScreen} />}
        {screen === 'project' && (
          <ProjectScreen setScreen={setScreen} setSelectedService={setSelectedService} />
        )}
        {screen === 'service' && (
          <ServiceScreen serviceId={selectedService} setScreen={setScreen} />
        )}
      </main>
    </div>
  )
}
