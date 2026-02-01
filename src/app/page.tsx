import { redirect } from 'next/navigation';
import { ROUTES } from '@/config';

export default function Page() {
  redirect(ROUTES.home);
}
