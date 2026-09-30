"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "react-bootstrap";
import {
  BsArrowUpRight,
  BsCalendarCheck,
  BsExclamationTriangle,
  BsLightningCharge,
} from "react-icons/bs";
import { useMyActivity } from "@/features/analytics/hooks/useMyActivity";
import type { UserActivitySummary } from "@/features/analytics/types/activity";
import type { InsightsPeriod } from "@/features/analytics/types/insights";

const previewByPeriod: Record<InsightsPeriod, UserActivitySummary> = {
  "7d": {
    totalActivities: 31,
    activeDays: 6,
    postsCreated: 3,
    commentsCreated: 9,
    postsLiked: 14,
    commentsLiked: 4,
    pagesFollowed: 1,
    invalidEvents: 0,
    activityBreakdown:
      "PostCreated: 3, CommentCreated: 9, PostLiked: 14, CommentLiked: 4, PageFollowed: 1",
  },
  "30d": {
    totalActivities: 126,
    activeDays: 18,
    postsCreated: 12,
    commentsCreated: 34,
    postsLiked: 56,
    commentsLiked: 21,
    pagesFollowed: 3,
    invalidEvents: 0,
    activityBreakdown:
      "PostCreated: 12, CommentCreated: 34, PostLiked: 56, CommentLiked: 21, PageFollowed: 3",
  },
  "90d": {
    totalActivities: 348,
    activeDays: 52,
    postsCreated: 31,
    commentsCreated: 96,
    postsLiked: 157,
    commentsLiked: 55,
    pagesFollowed: 9,
    invalidEvents: 0,
    activityBreakdown:
      "PostCreated: 31, CommentCreated: 96, PostLiked: 157, CommentLiked: 55, PageFollowed: 9",
  },
};

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateRange = (period: InsightsPeriod) => {
  const numberOfDays = Number.parseInt(period, 10);
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + 1);

  const start = new Date(end);
  start.setDate(start.getDate() - numberOfDays);

  return { startDate: formatLocalDate(start), endDate: formatLocalDate(end) };
};

const activityRows = [
  { key: "postsCreated", label: "Posts created", color: "bg-primary" },
  { key: "commentsCreated", label: "Comments created", color: "bg-success" },
  { key: "postsLiked", label: "Posts liked", color: "bg-danger" },
  { key: "commentsLiked", label: "Comments liked", color: "bg-warning" },
  { key: "pagesFollowed", label: "Pages followed", color: "bg-info" },
] as const;

const MyActivityPage = () => {
  const [period, setPeriod] = useState<InsightsPeriod>("30d");
  const { startDate, endDate } = getDateRange(period);
  const { data, isError, isFetching } = useMyActivity(startDate, endDate);
  const activity = data ?? previewByPeriod[period];
  const isPreview = !data;
  const maxCount = Math.max(...activityRows.map(({ key }) => activity[key]), 1);

  return (
    <div className="vstack gap-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">My Activity</h2>
          <p className="text-body-secondary mb-0">
            A summary of your posts, comments, likes, and follows.
          </p>
        </div>
        <div
          className="btn-group"
          role="group"
          aria-label="Select activity date range"
        >
          {(["7d", "30d", "90d"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={`btn ${period === option ? "btn-primary" : "btn-light"}`}
              aria-pressed={period === option}
              onClick={() => setPeriod(option)}
            >
              {option === "7d"
                ? "7 days"
                : option === "30d"
                  ? "30 days"
                  : "90 days"}
            </button>
          ))}
        </div>
      </div>

      {isPreview && (
        <div className="alert alert-warning py-2 mb-0" role="status">
          <strong>Sample data</strong>
          <span className="ms-2">
            {isError
              ? "The activity API is not available yet."
              : isFetching
                ? "Loading activity from the API..."
                : "These example figures will be replaced by your activity API response."}
          </span>
        </div>
      )}

      <Row className="g-3">
        <Col sm={6} xl={3}>
          <Card className="h-100">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small fw-semibold text-body-secondary">
                  Total activities
                </span>
                <BsLightningCharge
                  className="text-primary"
                  size={20}
                  aria-hidden="true"
                />
              </div>
              <strong className="h3">
                {activity.totalActivities.toLocaleString()}
              </strong>
              <div className="small text-body-secondary mt-2">
                Effective actions in this period
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={6} xl={3}>
          <Card className="h-100">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small fw-semibold text-body-secondary">
                  Active days
                </span>
                <BsCalendarCheck
                  className="text-success"
                  size={20}
                  aria-hidden="true"
                />
              </div>
              <strong className="h3">{activity.activeDays}</strong>
              <div className="small text-body-secondary mt-2">
                Days with recorded activity
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={6} xl={3}>
          <Card className="h-100">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small fw-semibold text-body-secondary">
                  Content created
                </span>
                <BsArrowUpRight
                  className="text-info"
                  size={20}
                  aria-hidden="true"
                />
              </div>
              <strong className="h3">
                {(
                  activity.postsCreated + activity.commentsCreated
                ).toLocaleString()}
              </strong>
              <div className="small text-body-secondary mt-2">
                Posts and comments
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={6} xl={3}>
          <Card className="h-100">
            <CardBody>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small fw-semibold text-body-secondary">
                  Invalid events
                </span>
                <BsExclamationTriangle
                  className={
                    activity.invalidEvents ? "text-danger" : "text-success"
                  }
                  size={20}
                  aria-hidden="true"
                />
              </div>
              <strong className="h3">{activity.invalidEvents}</strong>
              <div className="small text-body-secondary mt-2">
                Invalid or orphaned references
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="h-100">
            <CardHeader className="bg-transparent">
              <h3 className="h6 mb-1">Activity breakdown</h3>
              <p className="small text-body-secondary mb-0">
                Actions counted by type
              </p>
            </CardHeader>
            <CardBody className="vstack gap-3">
              {activityRows.map(({ key, label, color }) => {
                const count = activity[key];
                const width =
                  count === 0 ? 0 : Math.max((count / maxCount) * 100, 4);

                return (
                  <div key={key}>
                    <div className="d-flex justify-content-between small mb-2">
                      <span>{label}</span>
                      <strong>{count.toLocaleString()}</strong>
                    </div>
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label={label}
                      aria-valuenow={count}
                      aria-valuemin={0}
                      aria-valuemax={maxCount}
                    >
                      <div
                        className={`progress-bar ${color}`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="h-100">
            <CardHeader className="bg-transparent">
              <h3 className="h6 mb-1">Engagement actions</h3>
              <p className="small text-body-secondary mb-0">
                Interactions and new follows
              </p>
            </CardHeader>
            <CardBody className="vstack gap-3">
              <div className="d-flex justify-content-between border-bottom pb-3">
                <span>Posts liked</span>
                <strong>{activity.postsLiked.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-3">
                <span>Comments liked</span>
                <strong>{activity.commentsLiked.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Pages followed</span>
                <strong>{activity.pagesFollowed.toLocaleString()}</strong>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <div className="small text-body-secondary">
        Date range: {startDate} through {endDate} (end date exclusive)
      </div>
    </div>
  );
};

export default MyActivityPage;
