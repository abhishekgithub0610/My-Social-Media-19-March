"use client";
import { Card, CardBody, CardHeader, CardTitle, Nav } from "react-bootstrap";
import {
  getFollowingPages,
  getPages,
  getSuggestedPages,
} from "@/features/pages/services/pagesApi";
import PageRow from "./CourseRow";
import CreateCourseButton from "@/shared/components/ui/CreateCourseButton";
import { useEffect, useState } from "react";
import Link from "next/link";
import CourseRow from "./CourseRow";

type CourseType = {
  id: string;
  displayName: string;
  aboutCourse: string;
  courseImageUrl?: string;
  isFollowing: boolean;
};

const CourseList = () => {
  //const CourseList = async () => {
  const [courses, setCourses] = useState<CourseType[]>([]);

  const [activeTab, setActiveTab] = useState<"following" | "suggestions">(
    "suggestions",
  );

  useEffect(() => {
    const fetchCourses = async () => {
      let data: CourseType[] = [];

      if (activeTab === "following") {
        data = await getFollowingCourses();
      } else {
        data = await getSuggestedCourses();
      }

      setCourses(data);
    };

    fetchCourses();
  }, [activeTab]);

  const getButtonStyle = (type: "following" | "suggestions" | "create") => {
    const isActive = activeTab === type;

    return {
      fontSize: "13px",
      padding: "8px 18px",
      borderRadius: "999px",
      border: "0",
      fontWeight: 600,
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap" as const,
      boxShadow:
        isActive || type === "create"
          ? "0 2px 8px rgba(79, 70, 229, 0.25)"
          : "none",

      background:
        type === "create"
          ? "linear-gradient(135deg, #10b981, #059669)" // green
          : isActive
            ? "linear-gradient(135deg, #4f46e5, #3b82f6)" // blue active
            : "#f8f9fa",

      color: type === "create" || isActive ? "#fff" : "#212529",

      cursor: "pointer",
    };
  };

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <CardHeader className="border-0 bg-white pb-3">
        <div className="d-flex flex-column gap-3">
          {/* Title */}
          <CardTitle className="mb-0 fw-bold fs-5">Courses</CardTitle>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <button
              onClick={() => setActiveTab("following")}
              style={getButtonStyle("following")}
            >
              Courses You Follow
            </button>

            <button
              onClick={() => setActiveTab("suggestions")}
              style={getButtonStyle("suggestions")}
            >
              New Course Suggestions
            </button>
            <Link
              href="/courses/create"
              className="btn"
              style={getButtonStyle("create")}
            >
              + Create Course
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-2">
        {(courses ?? []).map((course: CourseType) => (
          <CourseRow key={course.id} course={course} />
        ))}
      </CardBody>
    </Card>
  );
};

export default CourseList;
