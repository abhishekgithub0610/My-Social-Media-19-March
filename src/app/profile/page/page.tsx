"use client";
import { Col } from "react-bootstrap";
import Feeds from "@/features/post/components/Feeds";
import CreatePostCard from "@/features/post/components/CreatePostCard";
import { useState } from "react";
import { SocialPostType } from "@/types/data";
import { usePage } from "@/context/PageContext";
import { useSearchParams } from "next/navigation";
const PageProfileFeed = ({ params }: { params: { pageId: string } }) => {
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const page = usePage();
  const searchParams = useSearchParams();

  const pageId = searchParams.get("pageId") || "";
  return (
    <>
      <Col md={12} lg={12} className="vstack gap-4">
        {page?.isOwner && (
          <CreatePostCard
            isPagePost={true}
            onPostCreated={(newPost) => {
              const pageinfo = page
                ? {
                    id: page.id,
                    name: page.displayName,
                    avatar: page.pageImageUrl,
                  }
                : undefined;
              setPosts((prev) => [{ ...newPost, pageinfo }, ...prev]);
            }}
          />
        )}
        <Feeds
          posts={posts}
          setPosts={setPosts}
          feedType="page"
          pageId={pageId}
        />
      </Col>
    </>
  );
};

export default PageProfileFeed;
