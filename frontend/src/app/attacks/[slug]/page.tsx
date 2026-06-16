import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import AttackIcon from '@/components/attacks/AttackIcon';
import { ATTACKS, getAttackBySlug } from '@/content/attacks';

export function generateStaticParams() {
  return ATTACKS.map((attack) => ({ slug: attack.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const attack = getAttackBySlug(slug);

  if (!attack) {
    return { title: 'Атака не найдена' };
  }

  return {
    title: `${attack.title} — подробный разбор`,
    description: attack.description,
  };
}

export default async function AttackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const attack = getAttackBySlug(slug);

  if (!attack) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cyber-black px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link href="/" className="text-sm text-cyber-blue hover:text-cyber-purple">
            ← На главную
          </Link>

          <Card className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-cyber-dark p-3 text-cyber-blue">
                <AttackIcon name={attack.icon} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyber-green">Атака</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-50 sm:text-4xl">{attack.title}</h1>
                <p className="mt-3 max-w-3xl text-slate-300">{attack.description}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-50">Как это работает</h2>
              <p className="mt-3 text-slate-300">{attack.overview}</p>
              <p className="mt-4 rounded-lg border border-cyber-blue/20 bg-cyber-blue/5 p-4 text-sm text-slate-200">
                {attack.scenario}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-50">Признаки атаки</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                {attack.signs.map((sign) => (
                  <li key={sign} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-cyber-blue" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-50">Что делать</h2>
            <p className="mt-3 text-slate-300">{attack.mitigation}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-3">
              {attack.tips.map((tip) => (
                <li key={tip} className="rounded-lg bg-cyber-dark/70 p-4 text-sm text-slate-200">
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-cyber-purple/30">
            <h2 className="text-xl font-semibold text-slate-50">Интересный факт</h2>
            <p className="mt-3 text-slate-300">{attack.interesting}</p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
