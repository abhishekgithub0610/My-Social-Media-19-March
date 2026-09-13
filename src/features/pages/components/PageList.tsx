"use client";
import { Card, CardBody, CardHeader, CardTitle, Nav } from "react-bootstrap";
import {
  getFollowingPages,
  getPages,
  getSuggestedPages,
} from "@/features/pages/services/pagesApi";
import PageRow from "./PageRow";
import CreatePageButton from "@/shared/components/ui/CreatePageButton";
import { useEffect, useState } from "react";
import Link from "next/link";

type PageType = {
  id: string;
  displayName: string;
  aboutPage: string;
  pageImageUrl?: string;
  isFollowing: boolean;
};

const PageList = () => {
  const [pages, setPages] = useState<PageType[]>([]);

  const [activeTab, setActiveTab] = useState<"following" | "suggestions">(
    "suggestions",
  );

  useEffect(() => {
    const fetchPages = async () => {
      let data: PageType[] = [];

      if (activeTab === "following") {
        data = await getFollowingPages();
      } else {
        data = await getSuggestedPages();
      }

      setPages(data);
    };

    fetchPages();
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
          <CardTitle className="mb-0 fw-bold fs-5">Pages</CardTitle>

          {/* Buttons */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <button
              onClick={() => setActiveTab("following")}
              style={getButtonStyle("following")}
            >
              Pages You Follow
            </button>

            <button
              onClick={() => setActiveTab("suggestions")}
              style={getButtonStyle("suggestions")}
            >
              New Page Suggestions
            </button>
            <Link
              href="/pages/create"
              className="btn"
              style={getButtonStyle("create")}
            >
              + Create Page
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-2">
        {(pages ?? []).map((page: PageType) => (
          <PageRow key={page.id} page={page} />
        ))}
      </CardBody>
    </Card>
  );
};

export default PageList;
