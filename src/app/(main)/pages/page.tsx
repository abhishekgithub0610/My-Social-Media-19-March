import { Col } from "react-bootstrap";
import PageList from "@/features/pages/components/PageList";
import CreatePageButton from "@/shared/components/ui/CreatePageButton"; // ✅ NEW

const Pages = () => {
  return (
    <Col md={10} lg={8} className="vstack gap-4">
      {/* 🔥 CLIENT BUTTON */}
      <CreatePageButton />

      {/* 📄 SERVER COMPONENT */}
      <PageList />
    </Col>
  );
};

export default Pages;

// "use client";

// import { Button, Col } from "react-bootstrap";
// import { useRouter } from "next/navigation";
// import PageList from "@/features/pages/components/PageList";

// const Pages = () => {
//   const router = useRouter();

//   return (
//     <Col md={10} lg={8} className="vstack gap-4">
//       {/* 🔥 BIG CTA BUTTON */}
//       <Button
//         variant="primary"
//         size="lg"
//         className="fw-bold py-3"
//         onClick={() => router.push("/pages/create")}
//       >
//         + Create New Page
//       </Button>

//       {/* 📄 FOLLOWED PAGES */}
//       <PageList />
//     </Col>
//   );
// };

// export default Pages;
