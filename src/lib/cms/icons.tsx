import {
  Award, BadgeCheck, Calendar, CheckCircle, ClipboardCheck, Clock, Cpu, Gem, Heart, HeartHandshake, Leaf, Lock,
  MapPin, MessageCircle, Microscope, Phone, ShieldCheck, Smile, Sparkles, Star, Stethoscope, Sun, Target, ThumbsUp,
  UserCheck, Users, Zap,
  type LucideIcon,
} from 'lucide-react';

/** A fixed set rather than all of lucide, which would add the whole icon library to client bundles. */
export const CMS_ICONS: Record<string, LucideIcon> = {
  Award, BadgeCheck, Calendar, CheckCircle, ClipboardCheck, Clock, Cpu, Gem, Heart, HeartHandshake, Leaf, Lock,
  MapPin, MessageCircle, Microscope, Phone, ShieldCheck, Smile, Sparkles, Star, Stethoscope, Sun, Target, ThumbsUp,
  UserCheck, Users, Zap,
};

export function CmsIcon({ name, className }: { name: string; className?: string }) {
  const Component = CMS_ICONS[name] ?? Sparkles;
  return <Component className={className} />;
}
