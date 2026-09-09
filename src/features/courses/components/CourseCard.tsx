import { Card, CardBody } from "react-bootstrap";
import { Course } from "../types/course";

type CourseCardProps = {
  course: Course;
};

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card>
      <CardBody>
        <h5>{course.name}</h5>
        <p>{course.followers} followers</p>
      </CardBody>
    </Card>
  );
};

export default CourseCard;
