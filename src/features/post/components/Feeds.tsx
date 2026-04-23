"use client";
import Link from "next/link";
import type { CommentType, SocialPostType } from "@/types/data"; // to be deleted/confirmed
import { timeSince } from "@/utils/date"; // to be deleted/confirmed
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getFeed,
  getUserFeed,
  toggleCommentLike,
} from "@/features/post/services/postApi";
import { useParams } from "next/navigation";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import {
  BsBookmark,
  BsBookmarkCheck,
  BsChatFill,
  BsEnvelope,
  BsFlag,
  BsHandThumbsUpFill,
  BsLink,
  BsPencilSquare,
  BsPersonX,
  BsReplyFill,
  BsShare,
  BsSlashCircle,
  BsWhatsapp,
  BsFacebook,
  BsXCircle,
  BsThreeDots,
} from "react-icons/bs";
import LoadContentButton from "@/LoadContentButton"; //to be deleted/confirmed
import avatar12 from "@/assets/images/avatar/12.jpg";
import { useAuthStore } from "@/features/account/store/authStore";
const ActionMenu = ({ name }: { name?: string }) => {
  return (
    <Dropdown>
      <DropdownToggle
        as="a"
        className="text-secondary btn btn-secondary-soft-hover py-1 px-2 content-none cursor-pointer"
        id="cardFeedAction"
      >
        <BsThreeDots />
      </DropdownToggle>

      <DropdownMenu
        className="dropdown-menu-end"
        aria-labelledby="cardFeedAction"
      >
        <li>
          <DropdownItem href="#">
            {" "}
            <BsBookmark size={22} className="fa-fw pe-2" />
            Save post
          </DropdownItem>
        </li>
        <li>
          <DropdownItem href="#">
            {" "}
            <BsPersonX size={22} className="fa-fw pe-2" />
            Unfollow {name}{" "}
          </DropdownItem>
        </li>
        <li>
          <DropdownItem href="#">
            {" "}
            <BsXCircle size={22} className="fa-fw pe-2" />
            Hide post
          </DropdownItem>
        </li>
        <li>
          <DropdownItem href="#">
            {" "}
            <BsSlashCircle size={22} className="fa-fw pe-2" />
            Block
          </DropdownItem>
        </li>
        <li>
          <DropdownDivider />
        </li>
        <li>
          <DropdownItem href="#">
            {" "}
            <BsFlag size={22} className="fa-fw pe-2" />
            Report post
          </DropdownItem>
        </li>
      </DropdownMenu>
    </Dropdown>
  );
};

interface CommentItemProps extends CommentType {
  onLike: (commentId: string) => void;
}
const CommentItem = ({
  id,
  comment,
  likesCount,
  isLiked,
  children,
  socialUser,
  createdAt,
  image,
  onLike,
}: CommentItemProps) => {
  return (
    <li className="comment-item">
      {socialUser && (
        <>
          <div className="d-flex position-relative">
            <div className="avatar avatar-xs">
              <span role="button">
                <img
                  className="avatar-img rounded-circle"
                  src={
                    socialUser.avatar
                      ? socialUser.avatar.startsWith("http")
                        ? socialUser.avatar
                        : `http://localhost:7120/${socialUser.avatar}`
                      : "/default-avatar.png"
                  }
                  alt={socialUser.name + "-avatar"}
                  width={40}
                  height={40}
                />
              </span>
            </div>
            <div className="ms-2">
              <div className="bg-light rounded-start-top-0 p-3 rounded">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-1">
                    {" "}
                    <Link href="#"> {socialUser.name} </Link>
                  </h6>
                  <small className="ms-2">{timeSince(createdAt)}</small>
                </div>
                <p className="small mb-0">{comment}</p>
                {image && (
                  <Card className="p-2 border border-2 rounded mt-2 shadow-none">
                    <Image width={172} height={277} src={image} alt="" />
                  </Card>
                )}
              </div>

              <ul className="nav nav-divider py-2 small">
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-link nav-link p-0"
                    onClick={() => onLike(String(id))}
                  >
                    {isLiked ? "Unlike" : "Like"} ({likesCount})
                  </button>
                  {/* <Link className="nav-link" href="#">
                    {" "}
                    Like ({likesCount})
                  </Link> */}
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="#">
                    {" "}
                    Reply
                  </Link>
                </li>
                {children?.length && children?.length > 0 && (
                  <li className="nav-item">
                    <Link className="nav-link" href="#">
                      {" "}
                      View {children?.length} replies
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <ul className="comment-item-nested list-unstyled">
            {children?.map((childComment) => (
              <CommentItem
                key={childComment.id}
                {...childComment}
                onLike={onLike}
              />
            ))}
          </ul>
          {children?.length === 2 && (
            <LoadContentButton name="Load more replies" className="mb-3 ms-5" />
          )}
        </>
      )}
    </li>
  );
};
interface PostCardProps extends SocialPostType {
  onCommentLike: (commentId: string) => void;
}
const PostCard = ({
  createdAt,
  likesCount,
  caption,
  comments,
  commentsCount,
  image,
  socialUser,
  pageinfo,
  //photos,
  isVideo,
  onCommentLike,
}: PostCardProps) => {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const copyLinkForInstagram = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied for Instagram sharing");
    } catch {
      alert("Failed to copy link");
    }
  };
  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="avatar avatar-story me-2">
              {socialUser?.avatar && (
                <span role="button">
                  {" "}
                  <Image
                    className="avatar-img rounded-circle"
                    src={
                      pageinfo?.avatar
                        ? `http://localhost:7120/${pageinfo.avatar}`
                        : socialUser?.avatar
                          ? `http://localhost:7120/${socialUser.avatar}`
                          : "/default-avatar.png"
                    }
                    // src={
                    //   pageinfo?.avatar
                    //     ? `http://localhost:7120/${pageinfo.avatar}`
                    //     : socialUser?.avatar || "/default-avatar.png"
                    // }
                    alt="post-avatar"
                    width={40}
                    height={40}
                    unoptimized
                  />{" "}
                </span>
              )}
            </div>

            <div>
              <div className="nav nav-divider">
                <h6 className="nav-item card-title mb-0">
                  {pageinfo ? (
                    <Link href={`/profile/page?pageId=${pageinfo.id}`}>
                      {pageinfo.name}
                    </Link>
                  ) : (
                    <Link href={`/profile/user`}>{socialUser?.name}</Link>
                  )}
                </h6>
                <span className="nav-item small"> {timeSince(createdAt)}</span>
              </div>
              <p className="mb-0 small">Web Developer at StackBros</p>
            </div>
          </div>
          <ActionMenu name={socialUser?.name} />
        </div>
      </CardHeader>
      <CardBody>
        {caption && <p>{caption}</p>}
        {/* {image && image.startsWith("http") && !isVideo && (
          <Image
            className="card-img"
            src={image}
            alt="Post"
            width={500}
            height={500}
          />
        )} */}
        {image && !isVideo && (
          <Image
            className="card-img"
            src={image}
            alt="Post"
            width={500}
            height={500}
            unoptimized
          />
        )}
        {/* {image && !isVideo && (
          <Image
            className="card-img"
            src={image}
            alt="Post"onPostCreated
            width={40}
            height={40}
          />
        )} */}
        {isVideo && image && (
          <video controls className="w-100">
            <source src={image} />
          </video>
        )}

        <ul className="nav nav-stack py-3 small">
          <li className="nav-item">
            <Link
              className="nav-link active"
              href="#"
              data-bs-container="body"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-html="true"
              data-bs-custom-class="tooltip-text-start"
              data-bs-title="Frances Guerrero<br> Lori Stevens<br> Billy Vasquez<br> Judy Nguyen<br> Larry Lawson<br> Amanda Reed<br> Louis Crawford"
            >
              {" "}
              <BsHandThumbsUpFill size={18} className="pe-1" />
              Liked ({likesCount})
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="#">
              {" "}
              <BsChatFill size={18} className="pe-1" />
              Comments ({commentsCount})
            </Link>
          </li>
          <Dropdown className="ms-auto">
            <DropdownToggle
              as="a"
              className="nav-link content-none cursor-pointer"
            >
              <BsReplyFill className="me-1" /> Share
            </DropdownToggle>

            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem href={whatsappShare} target="_blank">
                <BsWhatsapp className="me-2" /> WhatsApp
              </DropdownItem>

              <DropdownItem href={facebookShare} target="_blank">
                <BsFacebook className="me-2" /> Facebook
              </DropdownItem>

              <DropdownItem onClick={copyLinkForInstagram}>
                <BsLink className="me-2" /> Instagram (Copy Link)
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* <Dropdown className="nav-item ms-sm-auto">
            <DropdownToggle
              as="a"
              className="nav-link mb-0 content-none cursor-pointer"
              id="cardShareAction"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <BsReplyFill size={16} className="flip-horizontal ps-1" />
              Share
            </DropdownToggle>

            <DropdownMenu
              className="dropdown-menu-end"
              aria-labelledby="cardShareAction"
            >
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsEnvelope size={20} className="fa-fw pe-2" />
                  Send via Direct Message
                </DropdownItem>
              </li>
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsBookmarkCheck size={20} className="fa-fw pe-2" />
                  Bookmark{" "}
                </DropdownItem>
              </li>
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsLink size={20} className="fa-fw pe-2" />
                  Copy link to post
                </DropdownItem>
              </li>
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsShare size={20} className="fa-fw pe-2" />
                  Share post via …
                </DropdownItem>
              </li>
              <li>
                <DropdownDivider />
              </li>
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsPencilSquare size={20} className="fa-fw pe-2" />
                  Share to News Feed
                </DropdownItem>
              </li>
            </DropdownMenu>
          </Dropdown> */}
        </ul>
        {comments && (
          <>
            <div className="d-flex mb-3">
              <div className="avatar avatar-xs me-2">
                <span role="button">
                  {" "}
                  <Image
                    className="avatar-img rounded-circle"
                    src={avatar12}
                    alt="avatar12"
                  />{" "}
                </span>
              </div>

              <form className="w-100 position-relative">
                <textarea
                  data-autoresize
                  className="form-control pe-4 bg-light"
                  rows={1}
                  placeholder="Add a comment..."
                  defaultValue={""}
                />
                <div className="position-absolute top-0 end-0">
                  <button className="btn" type="button">
                    🙂
                  </button>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="mb-0 rounded mt-2"
                  type="button"
                >
                  Post
                </Button>
              </form>
            </div>

            <ul className="comment-wrap list-unstyled">
              {comments.map((comment) => (
                <CommentItem
                  {...comment}
                  key={comment.id}
                  onLike={onCommentLike}
                />
              ))}
            </ul>
          </>
        )}
      </CardBody>
      <CardFooter className="border-0 pt-0">
        {comments && <LoadContentButton name=" Load more comments" />}
      </CardFooter>
    </Card>
  );
};
type FeedsProps = {
  posts: SocialPostType[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPostType[]>>;
  isUserProfile?: boolean;
  feedType?: "page" | "friends";
};
// const Feeds = () => {
const Feeds = ({
  posts,
  setPosts,
  isUserProfile = false,
  feedType,
}: FeedsProps) => {
  //const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const userId = user?.id;
  const params = useParams();
  // Replace your fetchPosts() logic inside Feeds with this updated version
  const pageId = params?.pageId as string;
  const handleCommentLike = async (commentId: string) => {
    await toggleCommentLike(commentId);

    setPosts((prev) =>
      prev.map((post) => ({
        ...post,
        comments: post.comments?.map((comment) =>
          String(comment.id) === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likesCount: comment.isLiked
                  ? comment.likesCount - 1
                  : comment.likesCount + 1,
              }
            : comment,
        ),
      })),
    );
  };
  // Decide active mode automatically
  const activeFeedType = feedType; // homepage tabs
  // const activeFeedType = isUserProfile
  //   ? "friends" // user profile = only user posts
  //   : pageId
  //     ? "page" // page profile = only page posts
  //     : feedType; // homepage tabs
  console.log("feedd typeeeee" + feedType);
  const fetchPosts = async (currentPage = page, forceFetch = false) => {
    //if (loading || !hasMore) return;
    if (!forceFetch && (loading || !hasMore)) return;

    setLoading(true);

    try {
      let res;

      // User profile page → always user feed
      // ✅ SIMPLE LOGIC ONLY
      if (feedType === "friends") {
        if (!userId) {
          setLoading(false);
          return;
        }
        res = await getUserFeed(userId, currentPage, 5);
      } else {
        res = await getFeed(currentPage, 5);
      }

      const mappedPosts = res.result.items
        .map((p): SocialPostType | null => {
          const firstMedia = p.media?.[0];
          const imageUrl = firstMedia?.url;

          const isPagePost = !!p.pageDetails;
          const isFriendPost = !p.pageDetails;

          // 🔥 Filter based on feedType
          if (
            (activeFeedType === "page" && !isPagePost) ||
            (activeFeedType === "friends" && !isFriendPost)
          ) {
            return null;
          }

          return {
            id: p.id,
            caption: p.content,
            image:
              imageUrl && imageUrl.startsWith("http")
                ? imageUrl
                : imageUrl
                  ? `http://localhost:7120/${imageUrl}`
                  : undefined,

            isVideo: firstMedia?.type === "video",
            createdAt: new Date(p.createdAt),
            likesCount: p.likesCount,
            commentsCount: p.commentsCount,

            socialUser: {
              id: p.user.id,
              name: p.user.name,
              avatar: p.user.avatar || "/default-avatar.png",
            },

            pageinfo: isPagePost
              ? {
                  id: p.pageDetails.id,
                  name: p.pageDetails.name,
                  avatar: p.pageDetails.avatar || "/default-avatar.png",
                }
              : undefined,
          };
        })
        .filter((post): post is SocialPostType => post !== null);

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = mappedPosts.filter((p) => p && !existingIds.has(p.id));
        return currentPage === 1 ? mappedPosts : [...prev, ...newPosts];
        //return [...prev, ...newPosts];
      });

      setHasMore(res.result.hasMore);
      setPage(currentPage + 1);
      //setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };
  useEffect(() => {
    const resetAndFetch = async () => {
      setPosts([]);
      setPage(1);
      setHasMore(true);

      await fetchPosts(1, true); // force fetch
    };

    resetAndFetch();
  }, [feedType, userId, pageId]);

  //   const load = async () => {
  //     setPosts([]); // 🔥 reset old posts
  //     setPage(1);
  //     setHasMore(true);
  //     await fetchPosts(); // fetch fresh data
  //   };
  //   load();
  // }, [refreshFeed]); // 🔥 KEY CHANGE
  // useEffect(() => {
  //   const load = async () => {
  //     await fetchPosts();
  //   };
  //   load();
  // }, []);
  // useEffect(() => {
  //   if (hasFetched.current) return;
  //   hasFetched.current = true;
  //   fetchPosts();
  // }, []);

  return (
    <>
      {/* Option 1: Using a Ternary for "No Posts" state */}
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} {...post} onCommentLike={handleCommentLike} />
        ))
      ) : (
        <div className="text-center">
          <h5>No posts available</h5>
        </div>
      )}

      {/* 🔥 Load More */}
      {hasMore && posts?.length > 0 && (
        <div className="text-center">
          <Button onClick={() => fetchPosts()} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );

  //   <>
  //     {" "}
  //     {posts?.map(
  //       (post) => (
  //         console.log("Rendering PostCard for post:", post),
  //         (<PostCard {...post} key={post.id} />)
  //       ),
  //       // <PostCard {...post} key={post.id || idx} />
  //     )}
  //     {/* Pending ....
  //     <SponsoredCard /> */}
  //     {hasMore && (
  //       <div className="text-center">
  //         <Button onClick={fetchPosts} disabled={loading}>
  //           {loading ? "Loading..." : "Load More"}
  //         </Button>
  //       </div>
  //     )}
  //     {/* <LoadMoreButton /> */}
  //   </>
  // );
};
export default Feeds;
