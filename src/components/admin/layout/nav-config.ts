import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Building2,
  CalendarCheck,
  FileText,
  GalleryHorizontalEnd,
  HelpCircle,
  History,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Newspaper,
  Package,
  Quote,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  SplitSquareHorizontal,
  Stethoscope,
  Tag,
  UserCog,
  UserPlus,
  UserRound,
  Users,
  Wand2,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Required permission key, or null if visible to any authenticated admin user. */
  permission: string | null;
  status: 'active' | 'placeholder';
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Single source of truth for the admin sidebar. Later phases add items to the
 * relevant section and flip `status` to 'active' as each module gets built —
 * no restructuring needed.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: null, status: 'active' }],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck, permission: 'appointments:read', status: 'active' },
      { label: 'Customers', href: '/admin/customers', icon: Users, permission: 'customers:read', status: 'active' },
      { label: 'Leads', href: '/admin/leads', icon: UserPlus, permission: 'leads:read', status: 'active' },
      { label: 'Campaigns', href: '/admin/campaigns', icon: Megaphone, permission: 'campaigns:read', status: 'active' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Services', href: '/admin/services', icon: Sparkles, permission: 'services:read', status: 'active' },
      { label: 'Concerns', href: '/admin/concerns', icon: Stethoscope, permission: 'concerns:read', status: 'active' },
      { label: 'Packages', href: '/admin/packages', icon: Package, permission: 'packages:read', status: 'active' },
      { label: 'Doctors', href: '/admin/doctors', icon: UserRound, permission: 'doctors:read', status: 'active' },
      { label: 'Clinics', href: '/admin/clinics', icon: Building2, permission: 'clinics:read', status: 'active' },
      { label: 'Before & After', href: '/admin/before-after', icon: GalleryHorizontalEnd, permission: 'before-after:read', status: 'active' },
      { label: 'Offers', href: '/admin/offers', icon: Tag, permission: 'offers:read', status: 'active' },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Quote, permission: 'testimonials:read', status: 'active' },
      { label: 'Blogs', href: '/admin/blogs', icon: Newspaper, permission: 'blogs:read', status: 'active' },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle, permission: 'faqs:read', status: 'active' },
      { label: 'Gallery', href: '/admin/gallery', icon: GalleryHorizontalEnd, permission: 'gallery:read', status: 'active' },
      { label: 'Homepage CMS', href: '/admin/homepage-cms', icon: LayoutTemplate, permission: 'homepage-cms:read', status: 'active' },
      { label: 'Custom Pages', href: '/admin/page-builder', icon: Wand2, permission: 'page-builder:read', status: 'active' },
      { label: 'Media Library', href: '/admin/media', icon: Images, permission: 'media:read', status: 'active' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, permission: 'analytics:read', status: 'active' },
      { label: 'SEO', href: '/admin/seo', icon: Search, permission: 'seo:read', status: 'active' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users', href: '/admin/users', icon: UserCog, permission: 'users:read', status: 'active' },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck, permission: 'roles:read', status: 'active' },
      { label: 'Settings', href: '/admin/settings', icon: SettingsIcon, permission: 'settings:read', status: 'active' },
      { label: 'Audit Log', href: '/admin/audit-log', icon: History, permission: 'audit-log:read', status: 'active' },
    ],
  },
];
