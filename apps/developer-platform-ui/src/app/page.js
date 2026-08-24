import { redirect } from 'next/navigation';

export default function RootPage() {
  // Simply redirect the root path to the /login page
  redirect('/login');
}
