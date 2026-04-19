// Create a new component: FeedTabs.tsx

"use client";

import { Card, CardBody } from "react-bootstrap";

type FeedTabsProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const FeedTabs = ({ selectedTab, setSelectedTab }: FeedTabsProps) => {
  return (
    <Card>
      <CardBody className="d-flex gap-3">
        <button
          type="button"
          className={`btn ${
            selectedTab === "page" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setSelectedTab("page")}
        >
          Page
        </button>

        <button
          type="button"
          className={`btn ${
            selectedTab === "friends" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setSelectedTab("friends")}
        >
          Friends
        </button>
      </CardBody>
    </Card>
  );
};

export default FeedTabs;
