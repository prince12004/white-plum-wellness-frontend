import SiteLayout from '../(site)/layout';
import NotFound from '../(site)/not-found';

/** This route sits outside (site), so its 404 has to bring the site chrome with it. */
export default function PageNotFound() {
  return (
    <SiteLayout>
      <NotFound />
    </SiteLayout>
  );
}
