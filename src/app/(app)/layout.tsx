import type { Metadata } from 'next';
import BottomNav from '@/components/layout/BottomNav';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import InstallBanner from '@/components/ui/InstallBanner';

export const metadata: Metadata = {
  title: 'GokaFood Dashboard',
  description: 'Manage your orders, wallet, favorites, and account with GokaFood. Fast food delivery across Nigeria from verified restaurants.',
  keywords: ['GokaFood app', 'food delivery dashboard', 'orders', 'wallet', 'favorites', 'account', 'Nigeria food delivery'],
  openGraph: {
    title: 'GokaFood Dashboard',
    description: 'Manage your food delivery orders, wallet, and favorites on GokaFood.',
    type: 'website',
    url: 'https://gokafood.com',
  },
};

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

