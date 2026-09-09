import { Col } from "react-bootstrap";
import { Metadata } from "next";
import CourseList from "@/features/courses/components/CourseList";
export const metadata: Metadata = {
  title: "Courses | My Social Media",
};
const Courses = () => {
  return (
    <Col md={10} lg={8} className="vstack gap-4">
      {/* 📄 SERVER COMPONENT */}
      <CourseList />
    </Col>
  );
};
export default Courses;
