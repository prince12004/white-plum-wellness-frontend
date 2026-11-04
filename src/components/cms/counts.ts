import { getAllCategories } from '@/data/categories';
import { getAllClinics } from '@/data/clinics';
import { getAllDoctors } from '@/data/doctors';
import { getAllServices } from '@/data/services';

const COUNTS: Record<string, () => Promise<unknown[]>> = {
  services: getAllServices,
  categories: getAllCategories,
  clinics: getAllClinics,
  doctors: getAllDoctors,
};

/** Swaps {services}, {categories}, {clinics} and {doctors} in admin text for the live counts. */
export async function fillCounts(text: string): Promise<string> {
  let result = text;
  for (const [token, load] of Object.entries(COUNTS)) {
    if (result.includes(`{${token}}`)) {
      result = result.replaceAll(`{${token}}`, String((await load()).length));
    }
  }
  return result;
}
