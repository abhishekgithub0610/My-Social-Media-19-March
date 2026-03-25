"use client";

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const CreatePageButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      size="lg"
      className="fw-bold py-3"
      onClick={() => router.push("/pages/create")}
    >
      + Create New Page
    </Button>
  );
};

export default CreatePageButton;
