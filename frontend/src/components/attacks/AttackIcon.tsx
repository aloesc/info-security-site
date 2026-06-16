import React from 'react';
import { EyeOff, Fish, KeyRound, Smartphone, Users } from 'lucide-react';

export type AttackIconName = 'phishing' | 'sim-swap' | 'session-hijacking' | 'brute-force' | 'social-engineering';

const ICONS: Record<AttackIconName, React.ReactNode> = {
  phishing: <Fish className="h-6 w-6" />,
  'sim-swap': <Smartphone className="h-6 w-6" />,
  'session-hijacking': <EyeOff className="h-6 w-6" />,
  'brute-force': <KeyRound className="h-6 w-6" />,
  'social-engineering': <Users className="h-6 w-6" />,
};

export default function AttackIcon({ name }: { name: AttackIconName }) {
  return <>{ICONS[name]}</>;
}
