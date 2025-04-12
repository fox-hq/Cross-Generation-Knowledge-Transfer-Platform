import { useLocation } from 'wouter';
import { Header } from '@/components/layout/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isHome = location === '/';

  return (
    <>
      {!isHome && <Header />} {/* 👈 Hide the default header on home */}
      <main>{children}</main>
    </>
  );
}
