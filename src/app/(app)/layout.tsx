import BottomNav from '@/components/layout/BottomNav';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import InstallBanner from '@/components/ui/InstallBanner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="desktop-layout">
        {/* Desktop sidebar — hidden on mobile via CSS */}
        <DesktopSidebar />

        {/* Main scrollable area */}
        <main className="desktop-main">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop via CSS */}
      <div className="mobile-bottom-nav">
        <BottomNav />
      </div>

      <InstallBanner />
    </div>
  );
}

