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
import { UserProfileType } from "@/features/users/types/user";
import { useAuthStore } from "@/features/account/store/authStore";

//const UserProfileFeed = ({ params }: { params: { pageId: string } }) => {
const UserProfileFeed = () => {
  const [posts, setPosts] = useState<SocialPostType[]>([]);
  const [user, setUser] = useState<UserProfileType | null>(null);
  const params = useParams();
  const { user: currentuser } = useAuthStore();
  const userId = currentuser?.id as string;
  useEffect(() => {
    if (userId) {
      getUserById(userId).then((data) => {
        setUser(data);
      });
    }
  }, [userId]);

  if (!user) {
    return <div className="text-center p-5">Loading feed...</div>;
  }
  //const page = usePage();
  return (
    <>
      <Col md={12} lg={12} className="vstack gap-4">
        {user.isOwner && (
          <CreatePostCard
            isUserProfile={true} // CHANGED: tells CreatePostCard this is user profile
            onPostCreated={(newPost) => {
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
        <Feeds
          posts={posts}
          setPosts={setPosts}
          isUserProfile={true}
          feedType="friends"
          pageId=""
        />{" "}
        {/* <CreatePostCard />
        <Feeds /> */}
      </Col>
    </>
  );
};

export default UserProfileFeed;
