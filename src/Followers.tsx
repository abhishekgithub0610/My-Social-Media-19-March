import { getPages, followPage } from "@/features/pages/services/pagesApi";
import Image from "next/image";
import { PageType } from "@/shared/types/PageType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "react-bootstrap";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const Followers = () => {
  const [pages, setPages] = useState<PageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingPageIds, setPendingPageIds] = useState<Set<string>>(new Set());
  const [recentlyFollowedPageIds, setRecentlyFollowedPageIds] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    let isActive = true;

    getPages()
      .then((result) => {
        if (isActive) setPages(result);
      })
      .catch((error) => {
        console.error("Failed to load pages:", error);
        toast.error("Failed to load pages");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleFollowPage = async (pageId: string) => {
    setPendingPageIds((previous) => new Set(previous).add(pageId));
    setRecentlyFollowedPageIds((previous) => new Set(previous).add(pageId));

    try {
      await followPage(pageId);
      setPages((previous) =>
        previous.map((page) =>
          page.id === pageId ? { ...page, isFollowing: true } : page,
        ),
      );
    } catch (error) {
      console.error("Failed to follow page:", error);
      setRecentlyFollowedPageIds((previous) => {
        const next = new Set(previous);
        next.delete(pageId);
        return next;
      });
      toast.error("Failed to follow page");
    } finally {
      setPendingPageIds((previous) => {
        const next = new Set(previous);
        next.delete(pageId);
        return next;
      });
    }
  };

  const pagesToFollow = pages
    .filter((page) => !page.isFollowing || recentlyFollowedPageIds.has(page.id))
    .slice(0, 5);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-0 border-0">
        <CardTitle className="mb-0">Pages to Follow</CardTitle>
      </CardHeader>

      <CardBody>
        {pagesToFollow.map((page) => {
          const showFollowedConfirmation = recentlyFollowedPageIds.has(page.id);

          return (
            <div key={page.id} className="hstack gap-2 mb-3">
              <Link
                href={`/profile/page?pageId=${page.id}`}
                className="d-flex align-items-center gap-2 overflow-hidden flex-grow-1 text-decoration-none"
              >
                <div className="avatar flex-shrink-0">
                  <Image
                    className="avatar-img rounded-circle"
                    src={
                      page.pageImageUrl
                        ? `http://localhost:7120/${page.pageImageUrl}`
                        : "/default-avatar.png"
                    }
                    alt={`${page.displayName} page`}
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>

                <div className="overflow-hidden">
                  <span className="h6 mb-0 d-block text-truncate">
                    {page.displayName}
                  </span>
                  <span className="mb-0 small text-muted text-truncate d-block">
                    {page.category}
                  </span>
                </div>
              </Link>

              <Button
                variant={showFollowedConfirmation ? "success" : "primary-soft"}
                className="rounded-circle icon-md flex-centered flex-shrink-0"
                style={
                  showFollowedConfirmation
                    ? { color: "#fff", opacity: 1, width: 40, height: 40 }
                    : undefined
                }
                onClick={() => handleFollowPage(page.id)}
                disabled={
                  showFollowedConfirmation || pendingPageIds.has(page.id)
                }
                aria-label={
                  showFollowedConfirmation
                    ? `Following ${page.displayName}`
                    : `Follow ${page.displayName}`
                }
              >
                {showFollowedConfirmation ? (
                  <BsCheckLg size={20} aria-hidden="true" />
                ) : (
                  <FaPlus size={14} aria-hidden="true" />
                )}
              </Button>
            </div>
          );
        })}

        <div className="d-grid mt-3">
          <Link href="/pages">
            <Button variant="primary-soft" size="sm" className="w-100">
              View More
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default Followers;
