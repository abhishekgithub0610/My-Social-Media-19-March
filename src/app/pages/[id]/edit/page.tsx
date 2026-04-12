// app/pages/[id]/edit/page.tsx

import CreatePageForm from "@/features/pages/components/CreatePageForm";
import { getPageById } from "@/features/pages/services/pagesApi";

const EditPage = async ({ params }: { params: { id: string } }) => {
  const page = await getPageById(params.id);

  return <CreatePageForm initialData={page} isEdit />;
};

export default EditPage;
