import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { AdminNavbar } from '@/components/admin/admin-navbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
