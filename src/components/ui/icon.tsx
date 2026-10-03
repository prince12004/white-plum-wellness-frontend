import * as LucideIcons from 'lucide-react';
import { type LucideProps } from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Component = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Component) return null;
  return <Component {...props} />;
}
