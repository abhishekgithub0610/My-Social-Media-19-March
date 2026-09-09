"use client";

import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/shared/components/ui/FollowButton ";
import { useAuthRedirect } from "@/features/account/hooks/useAuthRedirect";
import { useAuthStore } from "@/features/account/store/authStore";
type CourseType = {
  id: string;
  displayName: string;
  aboutCourse: string;
  courseImageUrl?: string;
  isFollowing: boolean;
};
const CourseRow = ({ course }: { course: CourseType }) => {
  useAuthRedirect();

  return (
    <div className="d-flex flex-column gap-2 py-2 border-bottom">
      {/* 🔹 ROW 1 */}
      <div className="d-flex align-items-center gap-2">
        {/* IMAGE */}
        <div className="avatar">
          {course.courseImageUrl && (
            <Image
              className="avatar-img rounded-circle"
              src={`http://localhost:7120/${course.courseImageUrl}`}
              alt="course"
              width={62}
              height={62}
              unoptimized
            />
          )}
        </div>

        {/* NAME */}
        <Link
          href={`/course/course?courseId=${course.id}`}
          className="text-decoration-none flex-grow-1"
        >
          {/* <Link
          href={`/profile/pages/${page.id}`}
          className="text-decoration-none flex-grow-1"
        > */}
          <h6 className="mb-0 text-dark fw-semibold">{course.displayName}</h6>
        </Link>

        {/* FOLLOW */}
        <FollowButton course={course} />
      </div>

      {/* 🔹 ROW 2 */}
      <Link
        href={`/courses/course?courseId=${course.id}`}
        className="text-decoration-none"
      >
        {/* <Link href={`/profile/pages/${page.id}`} className="text-decoration-none"> */}
        <p
          className="mb-0 text-muted small text-truncate"
          title={course.aboutCourse}
        >
          {course.aboutCourse}
        </p>
      </Link>
    </div>
  );
};

export default CourseRow;
