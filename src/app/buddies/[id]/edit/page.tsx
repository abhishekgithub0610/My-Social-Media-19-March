"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CreatePageForm from "@/features/pages/components/CreatePageForm";
import { getPageById } from "@/features/pages/services/pagesApi";
import { PageType } from "@/shared/types/PageType";

import { Col } from "react-bootstrap";

const EditPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState<PageType | null>(null);

  useEffect(() => {
    if (id) {
      getPageById(id as string).then(setPage);
    }
  }, [id]);

  if (!page) return <div>Loading...</div>;

  return (
    <Col md={8} lg={6} className="vstack gap-4">
      <CreatePageForm initialData={page} isEdit />
    </Col>
  );
};

export default EditPage;

// const EditPage = () => {
//   const { id } = useParams();
//   const [page, setPage] = useState<PageType | null>(null);

//   useEffect(() => {
//     if (id) {
//       getPageById(id as string).then(setPage);
//     }
//   }, [id]);

//   if (!page) return <div>Loading...</div>;

//   return <CreatePageForm initialData={page} isEdit />;
// };

// export default EditPage;

// // app/pages/[id]/edit/page.tsx

// import CreatePageForm from "@/features/pages/components/CreatePageForm";
// import { getPageById } from "@/features/pages/services/pagesApi";

// const EditPage = async ({ params }: { params: { id: string } }) => {
//   const page = await getPageById(params.id);

//   return <CreatePageForm initialData={page} isEdit />;
// };

// export default EditPage;
