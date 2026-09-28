"use client";
import Image from "next/image";
import { useAuthStore } from "@/features/account/store/authStore";
import { useSearchParams } from "next/navigation";
import {
  Card,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import {
  BsCalendar2EventFill,
  BsImageFill,
  BsSend,
  BsThreeDots,
  BsX,
} from "react-icons/bs";
import useToggle from "@/shared/hooks/useToggle";
import { toast } from "react-toastify";
import avatar3 from "@/assets/images/avatar/03.jpg";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { SocialPostType } from "@/types/data";
type CreatePostCardProps = {
  onPostCreated?: (post: SocialPostType) => void;
  isUserProfile?: boolean;
};
type PostAttachment = {
  file: File;
  preview: string;
};
type ApiPost = {
  id: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  media?: {
    url: string;
    type: "image" | "video";
  }[];
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
};
const CreatePostCard = ({
  onPostCreated,
  isUserProfile = false,
}: CreatePostCardProps) => {
  const { toggle: toggleEvent } = useToggle();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<PostAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      attachmentUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  const searchParams = useSearchParams();

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (selectedFiles.length === 0) return;

    const remainingSlots = Math.max(10 - attachments.length, 0);
    if (selectedFiles.length > remainingSlots) {
      toast.error("You can attach up to 10 files.");
    }

    const validFiles = selectedFiles.slice(0, remainingSlots).filter((file) => {
      if (file.type.startsWith("image") && file.size > 30 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 30 MB.`);
        return false;
      }

      if (file.type.startsWith("video") && file.size > 4 * 1024 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 4 GB.`);
        return false;
      }

      return file.type.startsWith("image") || file.type.startsWith("video");
    });

    const newAttachments = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    attachmentUrlsRef.current.push(
      ...newAttachments.map((attachment) => attachment.preview),
    );
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (preview: string) => {
    URL.revokeObjectURL(preview);
    attachmentUrlsRef.current = attachmentUrlsRef.current.filter(
      (url) => url !== preview,
    );
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.preview !== preview),
    );
  };

  const handleCreatePost = async () => {
    if ((!text.trim() && attachments.length === 0) || loading) return;

    try {
      setLoading(true);
      const state = useAuthStore.getState();
      const formData = new FormData();
      formData.append("content", text);
      formData.append("privacy", "PB");

      if (!isUserProfile) {
        const pageId = searchParams.get("pageId");

        if (pageId) {
          formData.append("pageId", pageId);
        }
      }
      attachments.forEach(({ file }) => {
        formData.append("files", file);
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("API Error:", error);
        toast.error("Failed to add post. Please try again.");
        return;
      }
      const json = await res.json();
      const post = json.result ?? json;
      onPostCreated?.(mapToFeedPost(post));

      setText("");
      attachmentUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      attachmentUrlsRef.current = [];
      setAttachments([]);
      toast.success("Post added successfully");
    } catch (err) {
      console.error("Post error:", err);
      toast.error("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const mapToFeedPost = (p: ApiPost): SocialPostType => {
    const firstMedia = p.media?.[0];
    const fullImageUrl = firstMedia?.url
      ? firstMedia.url.startsWith("http")
        ? firstMedia.url
        : `http://localhost:7120/${firstMedia.url}`
      : undefined;
    return {
      id: p.id,
      caption: p.content,
      image: fullImageUrl,
      isVideo: firstMedia?.type === "video",
      createdAt: p.createdAt,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      socialUser: {
        id: p.user.id,
        name: p.user.name,
        avatar: p.user.avatar || "/default-avatar.png",
      },
    };
  };
  return (
    <Card className="card-body">
      <input
        ref={fileInputRef}
        className="d-none"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFilesSelected}
      />
      <div className="d-flex mb-3">
        <div className="avatar avatar-xs me-2">
          <Image
            className="avatar-img rounded-circle"
            src={avatar3}
            alt="Your profile"
          />
        </div>
        <div className="w-100">
          <form onSubmit={(event) => event.preventDefault()}>
            <textarea
              className="form-control pe-4 border-0"
              rows={2}
              data-autoresize
              placeholder="Share your thoughts..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </form>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="row g-2 mb-3">
          {attachments.map((attachment) => (
            <div className="col-6 col-md-4" key={attachment.preview}>
              <div className="position-relative">
                {attachment.file.type.startsWith("image") ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.file.name}
                    className="img-fluid rounded w-100"
                  />
                ) : (
                  <video
                    src={attachment.preview}
                    controls
                    className="w-100 rounded"
                  />
                )}
                <button
                  type="button"
                  className="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                  aria-label={`Remove ${attachment.file.name}`}
                  onClick={() => removeAttachment(attachment.preview)}
                >
                  <BsX />
                </button>
              </div>
              <div className="small text-truncate mt-1">
                {attachment.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <ul className="nav nav-pills nav-stack small fw-normal align-items-center gap-2">
        <li className="nav-item">
          <button
            type="button"
            className="nav-link bg-light py-1 px-2 mb-0 border-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <BsImageFill size={20} className="text-success pe-2" />
            Photo/Video
          </button>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="nav-link bg-light py-1 px-2 mb-0 border-0"
            onClick={toggleEvent}
          >
            <BsCalendar2EventFill size={20} className="text-danger pe-2" />
            Event
          </button>
        </li>

        <li className="nav-item ms-lg-auto">
          <Dropdown drop="start">
            <DropdownToggle
              as="button"
              className="nav-link bg-light py-1 px-2 mb-0 content-none border-0"
              id="feedActionShare"
              aria-expanded="false"
            >
              <BsThreeDots />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end" aria-labelledby="feedActionShare">
              <DropdownItem href="#">Create a poll</DropdownItem>
              <DropdownItem href="#">Ask a question</DropdownItem>
              <DropdownDivider />
              <DropdownItem href="#">Help</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </li>

        <li className="nav-item">
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleCreatePost}
            disabled={loading || (!text.trim() && attachments.length === 0)}
          >
            <BsSend />
            {loading ? "Posting..." : "Add post"}
          </button>
        </li>
      </ul>
    </Card>
  );
};
export default CreatePostCard;
