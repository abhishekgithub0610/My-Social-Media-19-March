import { Col } from "react-bootstrap";
// import Stories from "@/features/post/components/Stories";
import Feeds from "@/features/post/components/Feeds";
import CreatePostCard from "@/features/post/components/CreatePostCard";

const ProfileFeed = ({ params }: { params: { pageId: string } }) => {
  return (
    <>
      <Col md={12} lg={12} className="vstack gap-4">
        <CreatePostCard />
        <Feeds />
      </Col>
    </>
  );
};

export default ProfileFeed;
