import AdminNavbar from "@/components/bar/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <div className="pt-20">
        {children}
      </div>
    </>
  );
}
