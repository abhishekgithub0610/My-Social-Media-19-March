"use client";

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const CreatePageButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/pages/create")}
      size="sm" // 👈 makes it smaller
      className="fw-semibold px-3 py-1 rounded-pill border-0"
      style={{
        fontSize: "12px",
        background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
        boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(79, 70, 229, 0.25)";
      }}
    >
      + Create Page
    </Button>
  );
};

export default CreatePageButton;

// "use client";

// import { Button } from "react-bootstrap";
// import { useRouter } from "next/navigation";

// const CreatePageButton = () => {
//   const router = useRouter();

//   return (
//     <Button
//       onClick={() => router.push("/pages/create")}
//       className="fw-semibold px-4 py-2 rounded-pill border-0"
//       style={{
//         fontSize: "14px",
//         background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
//         boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
//         transition: "all 0.2s ease",
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = "translateY(-1px)";
//         e.currentTarget.style.boxShadow = "0 6px 16px rgba(79, 70, 229, 0.4)";
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = "translateY(0)";
//         e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
//       }}
//     >
//       + Create Page
//     </Button>
//   );
// };

// export default CreatePageButton;

// "use client";

// import { Button } from "react-bootstrap";
// import { useRouter } from "next/navigation";

// const CreatePageButton = () => {
//   const router = useRouter();

//   return (
//     <Button
//       variant="primary"
//       size="lg"
//       className="fw-bold py-3"
//       onClick={() => router.push("/pages/create")}
//     >
//       + Create New Page
//     </Button>
//   );
// };

// export default CreatePageButton;
