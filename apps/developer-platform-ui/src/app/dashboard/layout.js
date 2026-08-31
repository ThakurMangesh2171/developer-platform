import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ marginLeft: '260px', width: 'calc(100% - 260px)', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: '40px', flex: 1, position: 'relative' }}>
          {/* Subtle background glow for dashboard */}
          <div className="bg-radial-glow" style={{ top: '0%', left: '100%', opacity: 0.5 }}></div>
          {children}
        </main>
      </div>
    </div>
  );
}
