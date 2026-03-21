import Navbar from "@/shared/components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="main-container">{children}</div>
    </>
  );
}
