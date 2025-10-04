import { AdminNavbar } from '@/components/admin/admin-navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
