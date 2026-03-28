const Page = ({ params }: { params: { pageId: string } }) => {
  return <div>Page ID: {params.pageId}</div>;
};

export default Page;
