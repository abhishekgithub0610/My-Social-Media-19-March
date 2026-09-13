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
            onPostCreated={(newPost) => {
              setPosts((prev) => [newPost, ...prev]);
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
