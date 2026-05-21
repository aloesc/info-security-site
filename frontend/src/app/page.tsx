import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import AttackCards from '@/components/sections/AttackCards';
import PlatformGuides from '@/components/sections/PlatformGuides';
import GameLobby from '@/components/sections/GameLobby';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AttackCards />
        <PlatformGuides />
        <GameLobby />
      </main>
      <Footer />
    </div>
  );
}
