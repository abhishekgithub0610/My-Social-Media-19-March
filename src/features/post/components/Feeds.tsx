"use client";
import Link from "next/link";
import type { CommentType, SocialPostType } from "@/types/data"; // to be deleted/confirmed
import { timeSince } from "@/utils/date"; // to be deleted/confirmed
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import collaborationImg from "@/assets/images/collaboration.png";
import {
  getFeed,
  getUserFeed,
  toggleCommentLike,
  togglePostLike,
  createComment,
  getPostComments,
} from "@/features/post/services/postApi";
import {
  deletePost,
  deleteComment,
  reportPost,
  reportComment,
  ReportReason,
} from "@/features/post/services/postApi";
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
  Collapse, // ✅ ADDED
  Modal,
  Form,
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
  BsChevronDown, // ✅ ADDED
  BsChevronUp, // ✅ ADDED
} from "react-icons/bs";
import LoadContentButton from "@/LoadContentButton"; //to be deleted/confirmed
import avatar12 from "@/assets/images/avatar/12.jpg";
import { useAuthStore } from "@/features/account/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
// ✅ ADDED: lightweight user type for posts/comments
export type SocialUserType = {
  id: string;
  name: string;
  avatar?: string;

  // optional fields
  mutualCount?: number;
  role?: string;
  status?: string;
  lastMessage?: string;
  lastActivity?: Date;
};
// Local helper for creating comment user safely

const ActionMenu = ({
  name,
  postId,
  onDelete,
  isOwner, // ✅ added
  onReport,
}: {
  name?: string;
  postId: string;
  onDelete: (postId: string) => void;
  isOwner: boolean; // ✅ added
  onReport: (postId: string) => void;
}) => {
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
          <DropdownItem onClick={(e) => e.preventDefault()}>
            {" "}
            <BsBookmark size={22} className="fa-fw pe-2" />
            Save post
          </DropdownItem>
        </li>
        <li>
          <DropdownItem onClick={(e) => e.preventDefault()}>
            {" "}
            <BsPersonX size={22} className="fa-fw pe-2" />
            Unfollow {name}{" "}
          </DropdownItem>
        </li>
        <li>
          <DropdownItem onClick={(e) => e.preventDefault()}>
            {" "}
            <BsXCircle size={22} className="fa-fw pe-2" />
            Hide post
          </DropdownItem>
        </li>
        <li>
          <DropdownItem onClick={(e) => e.preventDefault()}>
            {" "}
            <BsSlashCircle size={22} className="fa-fw pe-2" />
            Block
          </DropdownItem>
        </li>
        {isOwner && (
          <li>
            <DropdownItem
              onClick={() => {
                if (confirm("Are you sure you want to delete this post?")) {
                  onDelete(postId);
                }
              }}
            >
              <BsSlashCircle size={22} className="fa-fw pe-2" />
              Delete Post
            </DropdownItem>
          </li>
        )}
        <li>
          <DropdownDivider />
        </li>

        <li>
          <DropdownItem onClick={() => onReport(postId)}>
            <BsFlag size={22} className="fa-fw pe-2" />
            Report post
          </DropdownItem>
        </li>
      </DropdownMenu>
    </Dropdown>
  );
};
const CommentActionMenu = ({
  commentId,
  isOwner,
  onDelete,
  onReport,
}: {
  commentId: string;
  isOwner: boolean;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string) => void;
}) => {
  return (
    <Dropdown>
      <DropdownToggle
        as="a"
        className="text-secondary btn btn-secondary-soft-hover py-1 px-2 content-none cursor-pointer"
      >
        <BsThreeDots />
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        {isOwner && (
          <DropdownItem
            onClick={() => {
              if (confirm("Are you sure you want to delete this comment?")) {
                onDelete(commentId);
              }
            }}
          >
            <BsSlashCircle className="me-2" />
            Delete Comment
          </DropdownItem>
        )}

        <DropdownDivider />

        <DropdownItem onClick={() => onReport(commentId)}>
          <BsFlag className="me-2" />
          Report Comment
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
interface CommentItemProps extends CommentType {
  onLike: (commentId: string) => void;

  onReply: (
    postId: string,
    content: string,
    parentCommentId?: string,
  ) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  currentUserId?: string;
  postId: string;
  isReply?: boolean;
  onReportComment: (commentId: string) => Promise<void>;
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
  onReply,
  postId,
  isReply = false,
  onDeleteComment,
  currentUserId,
  onReportComment,
}: CommentItemProps) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const isOwner = currentUserId === socialUser?.id;
  // ✅ CHANGED: prevent multiple reply submissions
  const handleReply = async () => {
    if (!replyText.trim() || replyLoading) return;

    try {
      setReplyLoading(true);

      await onReply(postId, replyText, String(id));

      setReplyText("");
      setShowReplyBox(false);
      setShowReplies(true); // ✅ ADDED
    } catch (error) {
      console.error(error);
    } finally {
      setReplyLoading(false);
    }
  };
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
                {/* <div className="d-flex justify-content-between">
                  <h6 className="mb-1">
                    {" "}
                    <Link href="#"> {socialUser.name} </Link>
                  </h6>
                  <small className="ms-2">{timeSince(createdAt)}</small>
                </div> */}

                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">
                      <Link href="#">{socialUser.name}</Link>
                    </h6>

                    <small>{timeSince(createdAt)}</small>
                  </div>

                  <CommentActionMenu
                    commentId={String(id)}
                    isOwner={isOwner}
                    onDelete={onDeleteComment}
                    onReport={onReportComment}
                  />
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
                    onClick={(e) => {
                      e.preventDefault();
                      onLike(String(id));
                    }}
                  >
                    {isLiked ? "Unlike" : "Like"} ({likesCount})
                  </button>
                  {/* <Link className="nav-link" href="#">
                    {" "}
                    Like ({likesCount})
                  </Link> */}
                </li>
                {!isReply && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-link nav-link p-0"
                      onClick={() => setShowReplyBox((prev) => !prev)}
                    >
                      Reply
                    </button>
                  </li>
                )}
                {/* <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-link nav-link p-0"
                    onClick={() => setShowReplyBox((prev) => !prev)}
                  >
                    Reply
                  </button>
          
                </li> */}
                {/* ✅ CHANGED: safer optional chaining */}
                {!!children?.length && (
                  <li className="nav-item ms-2">
                    <button
                      type="button"
                      className="btn btn-link nav-link p-0 d-flex align-items-center gap-1"
                      onClick={() => setShowReplies((prev) => !prev)}
                    >
                      {showReplies ? (
                        <>
                          <BsChevronUp />
                          Hide replies
                        </>
                      ) : (
                        <>
                          <BsChevronDown />
                          View {children.length} replies
                        </>
                      )}
                    </button>
                  </li>
                )}
              </ul>

              {showReplyBox && (
                <div className="mt-2 ms-4">
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />

                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={handleReply}
                    disabled={replyLoading}
                  >
                    {replyLoading ? "Replying..." : "Reply"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Collapse in={showReplies}>
            <div>
              <ul className="comment-item-nested list-unstyled mt-3">
                {children?.map((childComment) => (
                  <CommentItem
                    key={childComment.id}
                    {...childComment}
                    onLike={onLike}
                    onReply={onReply}
                    onDeleteComment={onDeleteComment}
                    onReportComment={onReportComment}
                    currentUserId={currentUserId}
                    postId={postId}
                    isReply={true}
                  />
                ))}
              </ul>
            </div>
          </Collapse>
          {/* {children && children.length >= 2 && (
            <LoadContentButton name="Load more replies" className="mb-3 ms-5" />
          )} */}
        </>
      )}
    </li>
  );
};
interface PostCardProps extends SocialPostType {
  onCommentLike: (commentId: string) => void;
  onPostLike: (postId: string) => void;

  onCreateComment: (
    postId: string,
    content: string,
    parentCommentId?: string,
  ) => Promise<void>;

  onDeletePost: (postId: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<SocialPostType[]>>;
  onDeleteComment: (commentId: string) => void;
  onReportComment: (commentId: string) => void;

  onReportPost: (postId: string) => void;
}
const PostCard = ({
  id,
  createdAt,
  likesCount,
  caption,
  comments,
  commentsCount,
  image,
  socialUser,
  pageinfo,
  isVideo,

  isLiked,

  onCommentLike,
  onPostLike,
  onCreateComment,
  onDeletePost,
  setPosts,
  onDeleteComment,
  onReportComment,
  onReportPost,
}: PostCardProps) => {
  const { user } = useAuthStore(); // ✅ FIXED

  const isOwner = user?.id === socialUser?.id;
  // ✅ ADDED
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  // ✅ CHANGED: avoid hydration/SSR issue
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/post/${id}` : "";
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const copyLinkForInstagram = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      toast.success("Link copied successfully");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // ✅ ADDED: recursive reply insertion
  const addReplyRecursively = (
    comments: CommentType[],
    parentCommentId: string,
    newReply: CommentType,
  ): CommentType[] => {
    return comments.map((comment) => {
      if (String(comment.id) === parentCommentId) {
        return {
          ...comment,
          children: [newReply, ...(comment.children || [])],
          //children: [...(comment.children || []), newReply],
        };
      }

      return {
        ...comment,
        // children: comment.children
        //   ? addReplyRecursively(comment.children, parentCommentId, newReply)
        //   : [],
        children: comment.children
          ? addReplyRecursively(comment.children, parentCommentId, newReply)
          : comment.children,
      };
    });
  };
  // ✅ CHANGED
  const handleSubmitComment = async () => {
    if (!commentText.trim() || commentLoading) return;

    try {
      setCommentLoading(true);

      await onCreateComment(id, commentText);

      setCommentText("");
      setShowComments(true); // ✅ ADDED
    } catch (error) {
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };
  // const handleCreateComment = async () => {
  //   if (!commentText.trim() || commentLoading) return;

  //   try {
  //     setCommentLoading(true);

  //     await onCreateComment(id, commentText);

  //     setCommentText("");
  //     setShowComments(true); // ✅ ADDED
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setCommentLoading(false);
  //   }
  // };

  const handleToggleComments = async () => {
    // close comments
    if (showComments) {
      setShowComments(false);
      return;
    }

    // already loaded comments
    if (comments && comments.length > 0) {
      setShowComments(true);
      return;
    }

    try {
      setCommentsLoading(true);

      const response = await getPostComments(id);

      const fetchedComments: CommentType[] = response.result.map(
        (comment: any) => ({
          id: comment.id,

          comment: comment.comment,

          postId: id,

          socialUserId: comment.socialUser?.id || "",

          createdAt: new Date(comment.createdAt),

          likesCount: comment.likesCount,

          isLiked: comment.isLiked,

          socialUser: {
            id: comment.socialUser?.id || "",

            name: comment.socialUser?.name || "",

            avatar: comment.socialUser?.avatar || "/default-avatar.png",
          },

          children:
            comment.children?.map((reply: any) => ({
              id: reply.id,

              comment: reply.comment,

              postId: id,

              socialUserId: reply.socialUser?.id || "",

              createdAt: new Date(reply.createdAt),

              likesCount: reply.likesCount,

              isLiked: reply.isLiked,

              socialUser: {
                id: reply.socialUser?.id || "",

                name: reply.socialUser?.name || "",

                avatar: reply.socialUser?.avatar || "/default-avatar.png",
              },

              children: [],
            })) || [],
        }),
      );

      setPosts((prev: SocialPostType[]) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                comments: fetchedComments,
              }
            : post,
        ),
      );

      setShowComments(true);
    } catch (error) {
      console.error(error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (showComments && commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [comments, showComments]);

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
                    alt="post-avatar"
                    width={40}
                    height={40}
                    unoptimized
                  />{" "}
                </span>
              )}

              {/* {user?.avatar && (
                <span role="button">
                  <Image
                    className="avatar-img rounded-circle"
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar
                        : `http://localhost:7120/${user.avatar}`
                    }
                    alt="user-avatar"
                    width={40}
                    height={40}
                    unoptimized
                  />
                </span>
              )} */}
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
          <ActionMenu
            name={socialUser?.name}
            postId={id}
            onDelete={onDeletePost}
            onReport={onReportPost}
            isOwner={isOwner}
          />
        </div>
      </CardHeader>
      <CardBody>
        {caption && <p>{caption}</p>}

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

        {isVideo && image && (
          <video controls className="w-100">
            <source src={image} />
          </video>
        )}

        <ul className="nav nav-stack py-3 small">
          <li className="nav-item">
            <button
              type="button"
              className={`btn ${isLiked ? "text-primary" : "text-secondary"}`}
              onClick={() => onPostLike(id)}
            >
              <BsHandThumbsUpFill size={18} className="me-1" />
              {isLiked ? "Liked" : "Like"} ({likesCount})
            </button>
          </li>
          {/* <li className="nav-item">
            <button
              type="button"
              className="btn btn-link nav-link active p-0"
              onClick={() => onPostLike(id)}
            >
              <BsHandThumbsUpFill size={18} className="pe-1" />
              <span
                className={isLiked ? "text-primary fw-bold" : "text-secondary"}
              >
                {isLiked ? "Liked" : "Like"} ({likesCount})
              </span>{" "}
            </button>
          
          </li> */}

          <li className="nav-item">
            {/* <button
              type="button"
              className="nav-link btn btn-link p-0"
              onClick={() => setShowComments((prev) => !prev)}
            > */}

            <button
              type="button"
              className="nav-link btn btn-link p-0"
              onClick={handleToggleComments}
              disabled={commentsLoading}
            >
              <BsChatFill size={18} className="pe-1" />
              {commentsLoading
                ? "Loading..."
                : showComments
                  ? "Hide"
                  : "Comments"}{" "}
              ({commentsCount})
              {/* {showComments ? "Hide" : "Comments"} ({commentsCount}) */}
            </button>
          </li>

          {/* <li className="nav-item ms-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <BsChatFill size={18} className="me-1" />
              {showComments ? "Hide" : "Comments"} ({commentsCount})
            </button>
          </li> */}
          {/* <li className="nav-item">
            <Link className="nav-link" href="#">
              {" "}
              <BsChatFill size={18} className="pe-1" />
              Comments ({commentsCount})
            </Link>
          </li> */}
          <Dropdown className="ms-auto">
            <DropdownToggle
              as="a"
              className="nav-link content-none cursor-pointer d-flex align-items-center"
            >
              {/* Text comes first */}
              <span>Share</span>

              {/* Image comes second with ms-2 (Margin Start) to push it away from the text */}
              <img
                src={collaborationImg.src}
                alt="Share"
                width={22}
                height={22}
                className="ms-2"
              />
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
        </ul>
        {/* {comments && (
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
              <form
                className="w-100 position-relative"
                onSubmit={(e) => e.preventDefault()}
              >
                {" "}
                <textarea
                  className="form-control pe-4 bg-light"
                  rows={1}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mb-0 rounded mt-2"
                  type="button"
                  onClick={handleCreateComment}
                  disabled={commentLoading}
                >
                  {commentLoading ? "Posting..." : "Post"}
                </Button>
              </form>
             
            </div>

            <ul className="comment-wrap list-unstyled">
              {comments.map((comment) => (
                <CommentItem
                  {...comment}
                  key={comment.id}
                  onLike={onCommentLike}
                  onReply={onCreateComment}
                  postId={id}
                />
              ))}
            </ul>
          </>
        )} */}
        <Collapse in={showComments}>
          <div>
            {/* ============================================
                CHANGED EMPTY COMMENTS
            ============================================ */}

            {!comments?.length && (
              <div className="text-muted small mb-3">No comments yet</div>
            )}

            {/* ============================================
                UNCHANGED COMMENT LIST
            ============================================ */}

            <div
              ref={commentsContainerRef}
              className="comment-scroll-container"
              style={{
                maxHeight: "500px", // roughly 4 comments
                overflowY: "auto",
                paddingRight: "6px",
              }}
            >
              <ul className="comment-wrap list-unstyled mb-0">
                {comments?.map((comment: CommentType) => (
                  <CommentItem
                    {...comment}
                    key={comment.id}
                    onLike={onCommentLike}
                    onReply={onCreateComment}
                    onDeleteComment={onDeleteComment}
                    onReportComment={onReportComment}
                    currentUserId={user?.id}
                    postId={id}
                  />
                ))}
              </ul>
            </div>
            <div className="d-flex mb-3 mt-3">
              <div className="avatar avatar-xs me-2">
                {/* {socialUser?.avatar && (
                  <span role="button">
                    {" "}
                    <Image
                      className="avatar-img rounded-circle"
                      src={
                        socialUser?.avatar
                          ? `http://localhost:7120/${socialUser.avatar}`
                          : "/default-avatar.png"
                      }
                      alt="post-avatar"
                      width={40}
                      height={40}
                      unoptimized
                    />{" "}
                  </span>
                )} */}

                {user?.avatar && (
                  <span role="button">
                    <Image
                      className="avatar-img rounded-circle"
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `http://localhost:7120/${user.avatar}`
                      }
                      alt="user-avatar"
                      width={40}
                      height={40}
                      unoptimized
                    />
                  </span>
                )}
              </div>

              <form
                className="w-100 position-relative"
                onSubmit={(e) => e.preventDefault()}
              >
                <textarea
                  className="form-control pe-4 bg-light"
                  rows={1}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <Button
                  variant="primary"
                  size="sm"
                  className="mb-0 rounded mt-2"
                  type="button"
                  onClick={handleSubmitComment}
                  disabled={commentLoading}
                >
                  {commentLoading ? "Posting..." : "Post"}
                </Button>
              </form>
            </div>
            {/* <ul className="comment-wrap list-unstyled">
              {comments?.map((comment: any) => (
                <CommentItem
                  {...comment}
                  key={comment.id}
                  onLike={onCommentLike}
                  onReply={onCreateComment}
                  postId={id}
                />
              ))}
            </ul>
            {comments && comments.length > 2 && (
              <div className="mt-2">
                <LoadContentButton name="Load more comments" />
              </div>
            )} */}
          </div>
        </Collapse>
      </CardBody>
      {/* <CardFooter className="border-0 pt-0">
        {comments && <LoadContentButton name=" Load more comments" />}
      </CardFooter> */}
    </Card>
  );
};
type FeedsProps = {
  posts: SocialPostType[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPostType[]>>;
  isUserProfile?: boolean;
  feedType?: "page" | "friends";
  pageId?: string;
};
// const Feeds = () => {
const Feeds = ({
  posts,
  setPosts,
  isUserProfile = false,
  feedType,
  pageId,
}: FeedsProps) => {
  //const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // ✅ ADDED
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { user } = useAuthStore();
  const userId = user?.id;

  const [showReportModal, setShowReportModal] = useState(false);

  const [reportTargetId, setReportTargetId] = useState("");

  const [reportTargetType, setReportTargetType] = useState<"post" | "comment">(
    "post",
  );

  const [selectedReason, setSelectedReason] = useState<ReportReason>(
    ReportReason.Spam,
  );
  const [reportLoading, setReportLoading] = useState(false);
  const [description, setDescription] = useState("");

  // ✅ CHANGED: recursive comment like update
  const updateCommentLikeRecursively = (
    comments: CommentType[],
    commentId: string,
  ): CommentType[] => {
    return comments.map((comment) => {
      // update current comment
      if (String(comment.id) === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likesCount: comment.isLiked
            ? comment.likesCount - 1
            : comment.likesCount + 1,
        };
      }

      // recursively update children
      return {
        ...comment,
        children: comment.children
          ? updateCommentLikeRecursively(comment.children, commentId)
          : [],
      };
    });
  };

  // ✅ CHANGED
  const handleCommentLike = async (commentId: string) => {
    try {
      await toggleCommentLike(commentId);

      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          comments: post.comments
            ? updateCommentLikeRecursively(post.comments, commentId)
            : [],
        })),
      );
    } catch (error) {
      console.error("Like API failed:", error);
    }
  };
  const handlePostLike = async (postId: string) => {
    try {
      await togglePostLike(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,

                isLiked: !post.isLiked,

                likesCount: post.isLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              }
            : post,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addReplyRecursively = (
    comments: CommentType[],
    parentCommentId: string,
    reply: CommentType,
  ): CommentType[] => {
    return comments.map((comment) => {
      if (String(comment.id) === parentCommentId) {
        return {
          ...comment,
          children: [...(comment.children || []), reply],
        };
      }

      return {
        ...comment,
        // children: comment.children
        //   ? addReplyRecursively(comment.children, parentCommentId, reply)
        //   : [],
        children: comment.children
          ? addReplyRecursively(comment.children, parentCommentId, reply)
          : comment.children,
      };
    });
  };

  const removeCommentRecursively = (
    comments: CommentType[],
    commentId: string,
  ): CommentType[] => {
    return comments
      .filter((c) => String(c.id) !== commentId)
      .map((c) => ({
        ...c,
        children: c.children
          ? removeCommentRecursively(c.children, commentId)
          : [],
      }));
  };

  // ✅ ADDED: count comments + replies recursively
  const countComments = (comments: CommentType[]): number =>
    comments.reduce(
      (count, comment) => count + 1 + countComments(comment.children || []),
      0,
    );
  const commentExists = (comments: CommentType[], id: string): boolean => {
    return comments.some(
      (c) => String(c.id) === id || commentExists(c.children || [], id),
    );
  };
  // ✅ CHANGED
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setPosts((prev) =>
        prev.map((post) => {
          if (!commentExists(post.comments || [], commentId)) {
            return post;
          }

          const updatedComments = removeCommentRecursively(
            post.comments || [],
            commentId,
          );

          return {
            ...post,
            comments: updatedComments,
            commentsCount: countComments(updatedComments),
          };
        }),
      );

      toast.success("Comment deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };
  const closeReportModal = () => {
    setShowReportModal(false);
    setDescription("");
    setSelectedReason(ReportReason.Spam);
    setReportTargetId("");
  };
  const handleReportPost = (postId: string) => {
    setReportTargetId(postId);
    setReportTargetType("post");
    setShowReportModal(true);
  };

  const handleReportComment = (commentId: string) => {
    setReportTargetId(commentId);
    setReportTargetType("comment");
    setShowReportModal(true);
  };
  const submitReport = async () => {
    if (!reportTargetId || reportLoading) return;

    try {
      setReportLoading(true);

      if (reportTargetType === "post") {
        await reportPost(reportTargetId, selectedReason, description);
      } else {
        await reportComment(reportTargetId, selectedReason, description);
      }

      toast.success("Report submitted");

      closeReportModal();
    } catch (error) {
      console.error(error);

      toast.error("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };
  // const handleReportPost = async (postId: string) => {
  //   try {
  //     await reportPost(postId, ReportReason.Other);
  //     toast.success("Post reported successfully");
  //   } catch (error) {
  //     console.error(error);

  //     toast.error("Failed to report post");
  //   }
  // };

  // const handleReportComment = async (commentId: string) => {
  //   try {
  //     await reportComment(commentId, ReportReason.Other);

  //     toast.success("Comment reported successfully");
  //   } catch (error) {
  //     console.error(error);

  //     toast.error("Failed to report comment");
  //   }
  // };
  // const createUser = (user: any): UserType => ({
  //   id: user?.id || "",
  //   name: user?.name || "",
  //   avatar: user?.avatar || "/default-avatar.png",

  //   mutualCount: 0,
  //   role: "",
  //   status: "offline",
  //   lastMessage: "",
  //   lastActivity: new Date(),
  // });
  const handleCreateComment = async (
    postId: string,
    content: string,
    parentCommentId?: string,
  ) => {
    try {
      const response = await createComment(postId, content, parentCommentId);

      const newComment = response.result;
      console.log("Created comment:", response);
      const formattedComment: CommentType = {
        id: newComment.id,
        //comment: newComment.content,
        comment: newComment.comment,
        postId: postId, // ✅ ADDED

        socialUserId: newComment.socialUser?.id || "", // ✅ ADDED
        //socialUserId: user?.id || "", // ✅ ADDED
        createdAt: new Date(),

        likesCount: 0,
        isLiked: false,

        socialUser: {
          id: newComment.socialUser?.id || "",
          name: newComment.socialUser?.name || "",
          avatar: newComment.socialUser?.avatar || "/default-avatar.png",
          mutualCount: 0,
          role: "",
          status: "offline",
          lastMessage: "",
          lastActivity: new Date(),
        },

        children: [],
      };
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;

          // ✅ CHANGED: reply also increases total comments count
          if (parentCommentId) {
            return {
              ...post,

              commentsCount: post.commentsCount + 1,
              comments: addReplyRecursively(
                post.comments || [],
                parentCommentId,
                formattedComment,
              ),

              // comments: post.comments?.map((comment) =>
              //   String(comment.id) === parentCommentId
              //     ? {
              //         ...comment,

              //         children: [
              //           ...(comment.children || []),

              //           {
              //             id: newComment.id,
              //             comment: newComment.content,

              //             createdAt: new Date(),

              //             likesCount: 0,
              //             isLiked: false,

              //             socialUser: {
              //               id: user?.id || "",
              //               name: user?.name || "",
              //               avatar: user?.avatar || "/default-avatar.png",
              //             },

              //             children: [],
              //           },
              //         ],
              //       }
              //     : comment,
              // ),
            };
          }
          return {
            ...post,

            commentsCount: post.commentsCount + 1,
            comments: [formattedComment, ...(post.comments || [])],
            //comments: [...(post.comments || []), formattedComment],
            // comments: [
            //   ...(post.comments || []),

            //   {
            //     id: newComment.id,
            //     comment: newComment.content,

            //     createdAt: new Date(),

            //     likesCount: 0,
            //     isLiked: false,

            //     socialUser: {
            //       id: user?.id || "",
            //       name: user?.name || "",
            //       avatar: user?.avatar || "/default-avatar.png",
            //     },

            //     children: [],
            //   },
            // ],
          };
        }),
      );
    } catch (error) {
      console.error(error);
    }
  };
  // Decide active mode automatically
  const activeFeedType = feedType;
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
      } else if (feedType === "page" && pageId) {
        res = await getFeed(currentPage, 5, pageId);
      } else {
        console.error("Invalid feed type or missing pageId");
        setLoading(false);
        return;
      }

      const mappedPosts = res.result.items
        .map((p): SocialPostType | null => {
          console.log("post dataaaaaa", p);
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
            isLiked: p.isLikedByCurrentUser,
            //comments: p.comments || [],
            comments: [],
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
    } finally {
      // ✅ CHANGED: always reset loading
      setLoading(false);
    }
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

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDeletePost = async (postId: string) => {
    if (deletingId) return;

    const index = posts.findIndex((p) => p.id === postId); // ✅ BEFORE removal
    if (index === -1) return;

    const postToDelete = posts[index];
    setDeletingId(postId);

    // remove from UI
    setPosts((prev) => prev.filter((p) => p.id !== postId));

    const timeout = setTimeout(async () => {
      try {
        await deletePost(postId);
        toast.success("Post deleted permanently");
      } catch {
        toast.error("Delete failed");

        // rollback on failure
        setPosts((prev) => {
          const newPosts = [...prev];
          newPosts.splice(index, 0, postToDelete);
          return newPosts;
        });
      } finally {
        setDeletingId(null);
      }
    }, 5000);

    toast(
      ({ closeToast }) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <span>Post deleted</span>
          <button
            className="btn btn-sm btn-light"
            onClick={() => {
              clearTimeout(timeout);

              setPosts((prev) => {
                const newPosts = [...prev];
                newPosts.splice(index, 0, postToDelete);
                return newPosts;
              });

              setDeletingId(null);
              closeToast();
            }}
          >
            Undo
          </button>
        </div>
      ),
      { autoClose: 5000 },
    );
  };

  useEffect(() => {
    const lastPost = document.querySelector("#feed-loader");

    if (!lastPost) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchPosts();
      }
    });

    observerRef.current.observe(lastPost);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [posts, hasMore, loading]);
  return (
    <>
      {!loading && posts.length === 0 && (
        <div className="text-center">
          <h5>No posts available</h5>
        </div>
      )}
      {/* Option 1: Using a Ternary for "No Posts" state */}
      <AnimatePresence mode="popLayout">
        {" "}
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard
              {...post}
              setPosts={setPosts}
              onCommentLike={handleCommentLike}
              onPostLike={handlePostLike}
              onCreateComment={handleCreateComment}
              onDeletePost={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              onReportComment={handleReportComment}
              onReportPost={handleReportPost}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ✅ CHANGED: infinite scroll loader */}

      {hasMore && (
        <div id="feed-loader" className="text-center py-3">
          {loading && <span>Loading more posts...</span>}
        </div>
      )}
      <Modal show={showReportModal} onHide={closeReportModal}>
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>Report Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason</Form.Label>

            <Form.Select
              value={selectedReason}
              onChange={(e) =>
                setSelectedReason(Number(e.target.value) as ReportReason)
              }
            >
              <option value={ReportReason.Spam}>Spam</option>
              <option value={ReportReason.Harassment}>Harassment</option>
              <option value={ReportReason.HateSpeech}>Hate Speech</option>
              <option value={ReportReason.Violence}>Violence</option>
              <option value={ReportReason.SexualContent}>Sexual Content</option>
              <option value={ReportReason.Misinformation}>
                Misinformation
              </option>
              <option value={ReportReason.Other}>Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Description (optional)</Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReportModal}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={submitReport}
            disabled={reportLoading}
          >
            {reportLoading ? "Submitting..." : "Submit Report"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Feeds;
