"use client";
import { Col } from "react-bootstrap";
// import Stories from "@/features/post/components/Stories";
import Feeds from "@/features/post/components/Feeds";
import CreatePostCard from "@/features/post/components/CreatePostCard";
import { useState, useEffect } from "react";
import { usePage } from "@/context/PageContext";
import { SocialPostType } from "@/types/data";
import { useParams } from "next/navigation";
import { getUserById } from "@/features/users/services/userApi";
type UserProfileType = {
  id: string;
  fullName: string;
  email: string;
  profilePictureUrl?: string;
  isOwner: boolean;
};
//const UserProfileFeed = ({ params }: { params: { pageId: string } }) => {
const UserProfileFeed = () => {
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [user, setUser] = useState<UserProfileType | null>(null);
  const params = useParams();
  const userId = params?.userId as string;
  useEffect(() => {
    if (userId) {
      getUserById(userId).then((data) => {
        console.log("Fetched user for profile feed:", data);
        setUser(data);
      });
    }
  }, [userId]);

  console.log("User ProfileFeed received post details:", posts);

  if (!user) {
    return <div className="text-center p-5">Loading feed...</div>;
  }
  console.log("ProfileFeed received post details:", posts);
  //const page = usePage();
  return (
    <>
      <Col md={12} lg={12} className="vstack gap-4">
        {user.isOwner && (
          <CreatePostCard
            isUserProfile={true} // CHANGED: tells CreatePostCard this is user profile
            onPostCreated={(newPost) => {
              console.log("STEP 4: parent received", newPost);
              setPosts((prev) => [newPost, ...prev]);
            }}
          />
        )}
        {/* <CreatePostCard
          onPostCreated={(newPost) => {
            console.log("STEP 4: parent received", newPost);
            setPosts((prev) => [newPost, ...prev]);
          }}
        /> */}
        <Feeds posts={posts} setPosts={setPosts} isUserProfile={true} />{" "}
        {/* <CreatePostCard />
        <Feeds /> */}
      </Col>
    </>
  );
};

export default UserProfileFeed;
