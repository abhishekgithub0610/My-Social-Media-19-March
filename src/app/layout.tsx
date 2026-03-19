import QueryProvider from "@/providers/QueryProvider";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ IMPORTANT
import "@/assets/scss/style.scss"; // ✅ from template (adjust path if needed)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //useAuthInit(); // ✅ auto login

  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

// import QueryProvider from "@/providers/QueryProvider";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <QueryProvider>{children}</QueryProvider>
//       </body>
//     </html>
//   );
// }
