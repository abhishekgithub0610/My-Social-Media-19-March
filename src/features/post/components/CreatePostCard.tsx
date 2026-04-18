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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import {
  BsBookmarkCheck,
  BsCalendar2EventFill,
  BsCameraReels,
  BsEnvelope,
  BsImageFill,
  BsPencilSquare,
  BsThreeDots,
} from "react-icons/bs";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useToggle from "@/shared/hooks/useToggle"; //to be confirmed/deleted
import DropzoneFormInput from "@/shared/components/ui/DropzoneFormInput";
import { toast } from "react-toastify";
import avatar1 from "@/assets/images/avatar/01.jpg";
import avatar2 from "@/assets/images/avatar/02.jpg";
import avatar3 from "@/assets/images/avatar/03.jpg";
import avatar4 from "@/assets/images/avatar/04.jpg";
import avatar5 from "@/assets/images/avatar/05.jpg";
import avatar6 from "@/assets/images/avatar/06.jpg";
import avatar7 from "@/assets/images/avatar/07.jpg";
import { useEffect, useMemo, useState } from "react";
import { SocialPostType } from "@/types/data";
type EventForm = {
  title: string;
  description: string;
  duration: string;
  location: string;
  guest: string;
  privacy: string; // ✅ ADD THIS
};
type CreatePostCardProps = {
  onPostCreated?: (post: SocialPostType) => void;
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
// const CreatePostCard = () => {
const CreatePostCard = ({ onPostCreated }: CreatePostCardProps) => {
  const guests = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
  ];
  const { isTrue: isOpenMedia, toggle: toggleTextModal } = useToggle();
  const [loading, setLoading] = useState(false);
  //const [preview, setPreview] = useState<string | null>(null);
  const { isTrue: isOpenEvent, toggle: toggleEvent } = useToggle();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const { isTrue: isOpenPost, toggle: togglePost } = useToggle();
  const [activeModal, setActiveModal] = useState<"photo" | "video" | null>(
    null,
  );
  const eventFormSchema = yup.object({
    title: yup.string().required("Please enter event title"),
    description: yup.string().required("Please enter event description"),
    duration: yup.string().required("Please enter event duration"),
    location: yup.string().required("Please enter event location"),
    guest: yup
      .string()
      .email("Please enter valid email")
      .required("Please enter event guest email"),
    privacy: yup.string().required("Please select privacy"), // ✅ ADD
  });
  const [text, setText] = useState("");
  //const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const { control, handleSubmit, watch } = useForm<EventForm>({
    resolver: yupResolver(eventFormSchema),
    defaultValues: {
      privacy: "PB",
    },
  });
  // useEffect(() => {
  //   return () => {
  //     previews.forEach((url) => URL.revokeObjectURL(url));
  //   };
  // }, [previews]);
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // ✅ only once
  // useEffect(() => {
  //   if (!preview) return;
  //   return () => {
  //     URL.revokeObjectURL(preview);
  //   };
  // }, [preview]);
  //const privacy = watch("privacy"); // ✅ auto updates
  const privacy = useMemo(() => watch("privacy"), [watch]);
  const searchParams = useSearchParams();

  const handleCreatePost = async () => {
    console.log("Creating post...");
    try {
      setLoading(true);
      console.log("Creating post..22.");
      const state = useAuthStore.getState();
      console.log("Zustand AFTER setUser:", {
        user: state.user,
        accessToken: state.accessToken,
      });
      const formData = new FormData();
      formData.append("content", text);
      formData.append("privacy", privacy);

      const pageId = searchParams.get("pageId");
      if (pageId) {
        formData.append("pageId", pageId); // ✅ from URL
      }
      files.forEach((file) => {
        formData.append("files", file); // ✅ IMPORTANT: same key
      });
      const res = await fetch("http://localhost:7120/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.accessToken}`, // ✅ IMPORTANT
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("API Error:", error);
        setLoading(false); // ✅ FIX
        return;
      }

      // const data = await res.json();
      // console.log("Post created:", data);
      // onPostCreated?.(mapToFeedPost(data));
      const json = await res.json();
      const post = json.result ?? json;
      console.log("Post created:", post);

      onPostCreated?.(mapToFeedPost(post));
      console.log("STEP 2: mapped post", mapToFeedPost(post));

      // reset UI
      setText("");
      setFiles([]); // ✅ FIX
      setPreviews([]); // ✅ FIX

      setTimeout(() => {
        toggleTextModal();
      }, 300);

      setLoading(false);
      toast.success("Post added successfully 🚀");
    } catch (err) {
      console.error("Post error:", err);
      setLoading(false);
      toast.error("Failed to add post. Please try again.");
    }
  };
  const mapToFeedPost = (p: ApiPost): SocialPostType => {
    const firstMedia = p.media?.[0];
    const fullImageUrl = firstMedia?.url
      ? firstMedia.url.startsWith("http")
        ? firstMedia.url
        : `http://localhost:7120/${firstMedia.url}`
      : undefined;
    console.log("Mapping API post to feed post:", p);
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
  const openModal = () => {
    setText("");
    // setFile(null);
    // setPreview(null);
    setFiles([]); // ✅ FIX
    setPreviews([]); // ✅ FIX
    toggleTextModal();
  };
  return (
    <>
      <Card className="card-body">
        <div className="d-flex mb-3">
          <div className="avatar avatar-xs me-2">
            <span role="button">
              {" "}
              <Image
                className="avatar-img rounded-circle"
                src={avatar3}
                alt="avatar3"
              />{" "}
            </span>
          </div>

          <form className="w-100">
            <textarea
              className="form-control pe-4 border-0"
              rows={2}
              data-autoresize
              placeholder="Share your thoughts..."
              defaultValue={""}
            />
          </form>
        </div>

        <ul className="nav nav-pills nav-stack small fw-normal">
          <li className="nav-item">
            <a className="nav-link bg-light py-1 px-2 mb-0" onClick={openModal}>
              {" "}
              <BsImageFill size={20} className="text-success pe-2" />
              Photo/Video
            </a>
          </li>

          <li className="nav-item">
            <a
              className="nav-link bg-light py-1 px-2 mb-0"
              onClick={toggleEvent}
            >
              {" "}
              <BsCalendar2EventFill size={20} className="text-danger pe-2" />
              Event{" "}
            </a>
          </li>

          <Dropdown drop="start" className="nav-item ms-lg-auto">
            <DropdownToggle
              as="a"
              className="nav-link bg-light py-1 px-2 mb-0 content-none"
              id="feedActionShare"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <BsThreeDots />
            </DropdownToggle>

            <DropdownMenu
              className="dropdown-menu-end"
              aria-labelledby="feedActionShare"
            >
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsEnvelope size={21} className="fa-fw pe-2" />
                  Create a poll
                </DropdownItem>
              </li>
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsBookmarkCheck size={21} className="fa-fw pe-2" />
                  Ask a question{" "}
                </DropdownItem>
              </li>
              <li>
                <DropdownDivider />
              </li>
              <li>
                <DropdownItem href="#">
                  {" "}
                  <BsPencilSquare size={21} className="fa-fw pe-2" />
                  Help
                </DropdownItem>
              </li>
            </DropdownMenu>
          </Dropdown>
        </ul>
      </Card>
      {/* photo */}
      <Modal
        show={isOpenMedia}
        onHide={() => {
          setLoading(false); // ✅ reset loading
          toggleTextModal();
        }}
        centered
        className="fade"
        id="feedActionPhoto"
        tabIndex={-1}
        aria-labelledby="feedActionPhotoLabel"
        aria-hidden="true"
        container={typeof window !== "undefined" ? document.body : undefined}
      >
        <ModalHeader closeButton>
          <h5 className="modal-title" id="feedActionPhotoLabel">
            Add post
          </h5>
        </ModalHeader>
        <ModalBody>
          <div className="d-flex mb-3">
            <div className="avatar avatar-xs me-2">
              <Image
                className="avatar-img rounded-circle"
                src={avatar3}
                alt=""
              />
            </div>
            {/* <form className="w-100"> */}
            <textarea
              className="form-control pe-4 fs-3 lh-1 border-0"
              rows={2}
              placeholder="Share your thoughts..."
              value={text} // ✅ ADDED: bind with state
              onChange={(e) => setText(e.target.value)} // ✅ ADDED: update state
            />
            {/* </form> */}
          </div>
          <div>
            <label className="form-label">Upload attachment</label>
            <DropzoneFormInput
              label="Upload photo/video"
              icon={BsCameraReels}
              showPreview
              text="Drag here or click to upload photo."
              //   onFileUpload={(files) => {
              //     if (files?.length) {
              //       const selected = files[0];

              //       // ✅ VALIDATION
              //       if (
              //         !selected.type.startsWith("image") &&
              //         !selected.type.startsWith("video")
              //       ) {
              //         alert("Only image/video allowed");
              //         return;
              //       }

              //       setFile(selected);

              //       const url = URL.createObjectURL(selected);
              //       setPreview(url);
              //     }
              //   }}
              onFileUpload={(uploadedFiles) => {
                if (!uploadedFiles?.length) return;

                const newFiles = [...files, ...uploadedFiles];

                if (newFiles.length > 10) {
                  alert("Max 10 files allowed");
                  return;
                }

                const validFiles: File[] = [];
                const previewUrls: string[] = [];

                for (const file of uploadedFiles) {
                  if (
                    file.type.startsWith("image") &&
                    file.size > 30 * 1024 * 1024
                  ) {
                    alert("Image must be < 30MB");
                    continue;
                  }

                  if (
                    file.type.startsWith("video") &&
                    file.size > 4 * 1024 * 1024 * 1024
                  ) {
                    alert("Video must be < 4GB");
                    continue;
                  }

                  validFiles.push(file);
                  previewUrls.push(URL.createObjectURL(file));
                }

                setFiles((prev) => [...prev, ...validFiles]);
                setPreviews((prev) => [...prev, ...previewUrls]);
              }}
            />
            {/* ✅ ADDED: Preview section (image/video preview like Instagram) */}
            {previews.map((preview, index) => (
              <div key={index} className="mt-2">
                {files[index]?.type.startsWith("image") ? (
                  <img src={preview} className="img-fluid rounded" />
                ) : (
                  <video src={preview} controls className="w-100 rounded" />
                )}
              </div>
            ))}
            {/* {preview && (
              <div className="mt-3">
                {file?.type.startsWith("image") ? (
                  <img src={preview} className="img-fluid rounded" />
                ) : (
                  <video src={preview} controls className="w-100 rounded" />
                )}
              </div>
            )} */}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-danger-soft me-2"
            // data-bs-dismiss="modal"
            onClick={() => {
              setLoading(false); // ✅ stop loader
              toggleTextModal(); // ✅ close modal
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success-soft"
            onClick={handleCreatePost} // ✅ ADDED
            disabled={loading || (!text && files.length === 0)}
          >
            {loading ? "Posting..." : "Post"}
          </button>
          {/* <button type="button" className="btn btn-success-soft">
            Post
          </button> */}
        </ModalFooter>
      </Modal>

      {/* event */}
      {/* <Modal
        show={isOpenEvent}
        onHide={toggleEvent}
        centered
        className="fade"
        id="modalCreateEvents"
        tabIndex={-1}
        aria-labelledby="modalLabelCreateEvents"
        aria-hidden="true"
      >
        <form onSubmit={handleSubmit(() => {})}>
          <ModalHeader closeButton>
            <h5 className="modal-title" id="modalLabelCreateEvents">
              Create event
            </h5>
          </ModalHeader>
          <ModalBody>
            <Row className="g-4">
              <TextFormInput
                name="title"
                label="Title"
                placeholder="Event name here"
                containerClassName="col-12"
                control={control}
              />
              <TextAreaFormInput
                name="description"
                label="Description"
                rows={2}
                placeholder="Ex: topics, schedule, etc."
                containerClassName="col-12"
                control={control}
              />

              <Col sm={4}>
                <label className="form-label">Date</label>
                <DateFormInput
                  options={{ enableTime: false }}
                  className="form-control"
                  placeholder="Select date"
                />
              </Col>
              <Col sm={4}>
                <label className="form-label">Time</label>
                <DateFormInput
                  options={{ enableTime: true, noCalendar: true }}
                  className="form-control"
                  placeholder="Select time"
                />
              </Col>
              <TextFormInput
                name="duration"
                label="Duration"
                placeholder="1hr 23m"
                containerClassName="col-sm-4"
                control={control}
              />
              <TextFormInput
                name="location"
                label="Location"
                placeholder="Logansport, IN 46947"
                containerClassName="col-12"
                control={control}
              />
              <TextFormInput
                name="guest"
                type="email"
                label="Add guests"
                placeholder="Guest email"
                containerClassName="col-12"
                control={control}
              />
              <Col xs={12} className="mt-3">
                <ul className="avatar-group list-unstyled align-items-center mb-0">
                  {guests.map((avatar, idx) => (
                    <li className="avatar avatar-xs" key={idx}>
                      <Image
                        className="avatar-img rounded-circle"
                        src={avatar}
                        alt="avatar"
                      />
                    </li>
                  ))}
                  <li className="ms-3">
                    <small> +50 </small>
                  </li>
                </ul>
              </Col>
              <div className="mb-3">
                <DropzoneFormInput
                  showPreview
                  helpText="Drop presentation and document here or click to upload."
                  icon={BsFileEarmarkText}
                  label="Upload attachment"
                />
              </div>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="danger-soft"
              type="button"
              className="me-2"
              onClick={toggleEvent}
            >
              {" "}
              Cancel
            </Button>
            <Button variant="success-soft" type="submit">
              Create now
            </Button>
          </ModalFooter>
        </form>
      </Modal> */}
    </>
  );
};
export default CreatePostCard;
