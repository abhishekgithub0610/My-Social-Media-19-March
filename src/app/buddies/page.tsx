import { Col } from "react-bootstrap";
import { Metadata } from "next";
import BuddyList from "@/features/buddies/components/BuddyList";
export const metadata: Metadata = {
  title: "Buddies",
};
const Buddies = () => {
  return (
    <Col md={10} lg={8} className="vstack gap-4">
      {/* 📄 SERVER COMPONENT */}
      <BuddyList />
    </Col>
  );
};
export default Buddies;
