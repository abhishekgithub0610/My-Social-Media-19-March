"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardBody, Col } from "react-bootstrap";
import Feeds from "@/features/post/components/Feeds";
import { getSavedPosts } from "@/features/post/services/postApi";
import { useAuthStore } from "@/features/account/store/authStore";
import type { SocialPostType } from "@/types/data";
import type { PostFeedDto } from "@/features/post/types/post";

const mapSavedPost = (post: PostFeedDto): SocialPostType => {
  const firstMedia = post.media?.[0];
  const media = (post.media ?? [])
    .filter((item) => item.type !== "video" && Boolean(item.url))
    .map((item, index) => ({
      id: `${post.id}-${index}`,
      src: item.url.startsWith("http")
        ? item.url
        : `http://localhost:7120/${item.url}`,
      alt: `Post image ${index + 1}`,
    }));

  return {
    id: post.id,
    caption: post.content,
    image: firstMedia?.url
      ? firstMedia.url.startsWith("http")
        ? firstMedia.url
        : `http://localhost:7120/${firstMedia.url}`
      : undefined,
    isVideo: firstMedia?.type === "video",
    createdAt: new Date(post.createdAt),
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: post.isLikedByCurrentUser,
    isSaved: true,
    socialUser: {
      id: post.user.id,
      name: post.user.name,
      avatar: post.user.avatar || "/default-avatar.png",
    },
    pageinfo: post.pageDetails
      ? {
          id: post.pageDetails.id,
          name: post.pageDetails.name,
          avatar: post.pageDetails.avatar || "/default-avatar.png",
          isFollowing: post.pageDetails.isFollowing,
          pageType: post.pageDetails.pageType,
          followType: post.pageDetails.followType,
        }
      : undefined,
    media,
  };
};

const SavedPostsPage = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadSavedPosts = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (!user?.id || loading) return;

      setLoading(true);
      setLoadError(false);

      try {
        const response = await getSavedPosts(pageToLoad, 10);
        const mappedPosts = response.result.items.map(mapSavedPost);

        setPosts((previous) =>
          replace ? mappedPosts : [...previous, ...mappedPosts],
        );
        setPage(pageToLoad);
        setHasMore(response.result.hasMore);
      } catch (error) {
        console.error("Failed to load saved posts:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [loading, user?.id],
  );

  useEffect(() => {
    if (!user?.id) {
      setPosts([]);
      return;
    }

    void loadSavedPosts(1, true);
  }, [loadSavedPosts, user?.id]);

  return (
    <Col md={12} lg={12} className="vstack gap-4">
      <h2 className="h4 mb-0">Saved Posts</h2>
      {loading && posts.length === 0 ? (
        <div className="text-center text-muted py-5">
          Loading saved posts...
        </div>
      ) : loadError && posts.length === 0 ? (
        <Card>
          <CardBody className="text-center py-5">
            Could not load saved posts.
            <div>
              <Button
                variant="link"
                onClick={() => void loadSavedPosts(1, true)}
              >
                Try again
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : posts.length > 0 ? (
        <Feeds posts={posts} setPosts={setPosts} feedType="saved" />
      ) : (
        <Card>
          <CardBody className="text-center text-muted py-5">
            No saved posts yet.
          </CardBody>
        </Card>
      )}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="light"
            onClick={() => void loadSavedPosts(page + 1, false)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </Col>
  );
};

export default SavedPostsPage;
