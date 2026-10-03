import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Favourite } from '@white/types';
import { PackageCard } from '@/components/cards/package-card';
import { OfferCard } from '@/components/cards/offer-card';
import { getCustomerSession } from '@/lib/customer-session';
import { getPackageBySlug } from '@/data/packages';
import { getOfferBySlug } from '@/data/offers';

const NEST_API_URL = process.env.NEST_API_URL ?? 'http://localhost:4000/api';

async function getMyFavourites(): Promise<Favourite[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  try {
    const res = await fetch(`${NEST_API_URL}/favourites/mine`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return (await res.json()) as Favourite[];
  } catch {
    return [];
  }
}

export default async function DashboardSavedPage() {
  const customer = await getCustomerSession();
  if (!customer) redirect('/login');

  const favourites = await getMyFavourites();
  const savedPackages = favourites.filter((f) => f.itemType === 'package');
  const savedOffers = favourites.filter((f) => f.itemType === 'offer');

  const [packages, offers] = await Promise.all([
    Promise.all(savedPackages.map((f) => getPackageBySlug(f.itemSlug))),
    Promise.all(savedOffers.map((f) => getOfferBySlug(f.itemSlug))),
  ]);
  const resolvedPackages = packages.filter(Boolean);
  const resolvedOffers = offers.filter(Boolean);

  const isEmpty = resolvedPackages.length === 0 && resolvedOffers.length === 0;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-display text-xl font-semibold text-charcoal-900">Saved for Later</h2>
        <p className="mt-1 text-sm text-charcoal-500">Packages and offers you&apos;ve saved while browsing.</p>
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-ivory-300 bg-white p-10 text-center">
          <p className="text-sm text-charcoal-500">Nothing saved yet.</p>
          <p className="mt-1 text-xs text-charcoal-400">Look for the save icon on any package or offer to add it here.</p>
        </div>
      ) : (
        <>
          {resolvedPackages.length > 0 && (
            <div>
              <h3 className="font-display text-base font-semibold text-charcoal-900">Packages</h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {resolvedPackages.map((pkg) => pkg && <PackageCard key={pkg.slug} pkg={pkg} />)}
              </div>
            </div>
          )}
          {resolvedOffers.length > 0 && (
            <div>
              <h3 className="font-display text-base font-semibold text-charcoal-900">Offers</h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {resolvedOffers.map((offer) => offer && <OfferCard key={offer.slug} offer={offer} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
