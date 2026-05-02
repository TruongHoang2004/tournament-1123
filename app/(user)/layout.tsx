import Navbar from "@/components/bar/Navbar";
import Footer from "@/components/bar/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="relative flex-1 flex flex-col w-full bg-transparent mt-20">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </>
  );
}
