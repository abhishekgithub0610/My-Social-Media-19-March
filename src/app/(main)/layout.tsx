import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: "0px" }}>{children}</main>
      {/* <div className="main-container">{children}</div> */}
    </>
  );
}
