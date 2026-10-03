import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileStickyBar } from '@/components/layout/mobile-sticky-bar';
import { WhatsappFloatButton } from '@/components/layout/whatsapp-float-button';
import { MotionProvider } from '@/components/ui/motion-provider';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { PageTransition } from '@/components/ui/page-transition';

/** The public-site chrome (header/footer/WhatsApp float/mobile bar) lives here,
 * not in the true root layout — /admin routes share only the root's html/body/fonts,
 * not this shell, since they have their own Sidebar/Topbar chrome. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <MotionProvider>
        <ScrollProgress />
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <WhatsappFloatButton />
        <MobileStickyBar />
      </MotionProvider>
    </div>
  );
}
