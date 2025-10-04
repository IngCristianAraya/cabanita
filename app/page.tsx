import { HeroSection } from '@/components/home/hero-section';
import { FeaturedMenu } from '@/components/home/featured-menu';
import { InfoSection } from '@/components/home/info-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedMenu />
      <InfoSection />
    </main>
  );
}
