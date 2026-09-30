"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "react-bootstrap";
import type { IconType } from "react-icons";
import {
  BsArrowDownRight,
  BsArrowUpRight,
  BsBullseye,
  BsCollection,
  BsPeople,
  BsPieChart,
} from "react-icons/bs";
import { useMyInsights } from "@/features/analytics/hooks/useMyInsights";
import type {
  InsightsDashboard,
  InsightsPeriod,
} from "@/features/analytics/types/insights";

const previewByPeriod: Record<InsightsPeriod, InsightsDashboard> = {
  "7d": {
    period: "7d",
    followers: {
      total: 12480,
      changePercent: 2.1,
      trend: [24, 28, 27, 36, 34, 43, 50],
    },
    engagement: {
      rate: 4.8,
      changePoints: 0.2,
      trend: [23, 34, 28, 46, 40, 52, 61],
    },
    reach: {
      total: 21400,
      changePercent: -0.8,
      trend: [58, 48, 52, 39, 46, 34, 31],
    },
    pageCount: 3,
    audienceActivity: {
      mostActiveTime: "6-9 PM",
      topDay: "Thursday",
      byDay: [
        { day: "Mon", value: 46 },
        { day: "Tue", value: 59 },
        { day: "Wed", value: 53 },
        { day: "Thu", value: 88 },
        { day: "Fri", value: 66 },
        { day: "Sat", value: 72 },
        { day: "Sun", value: 43 },
      ],
    },
    pages: [
      {
        id: "design-club",
        name: "Design Club",
        followers: 4210,
        engagementRate: 5.2,
        reach: 8400,
      },
      {
        id: "weekend-eats",
        name: "Weekend Eats",
        followers: 2890,
        engagementRate: 3.7,
        reach: 6100,
      },
      {
        id: "city-frames",
        name: "City Frames",
        followers: 5380,
        engagementRate: 4.9,
        reach: 6900,
      },
    ],
  },
  "30d": {
    period: "30d",
    followers: {
      total: 12480,
      changePercent: 8.2,
      trend: [18, 26, 23, 35, 32, 42, 39, 53, 49, 65, 61, 76],
    },
    engagement: {
      rate: 4.8,
      changePoints: 0.6,
      trend: [23, 34, 28, 46, 40, 52, 48, 62, 55, 70, 65, 78],
    },
    reach: {
      total: 86200,
      changePercent: -2.1,
      trend: [75, 68, 73, 58, 64, 54, 61, 47, 52, 42, 46, 35],
    },
    pageCount: 3,
    audienceActivity: {
      mostActiveTime: "6-9 PM",
      topDay: "Thursday",
      byDay: [
        { day: "Mon", value: 44 },
        { day: "Tue", value: 61 },
        { day: "Wed", value: 56 },
        { day: "Thu", value: 91 },
        { day: "Fri", value: 69 },
        { day: "Sat", value: 76 },
        { day: "Sun", value: 48 },
      ],
    },
    pages: [
      {
        id: "design-club",
        name: "Design Club",
        followers: 4210,
        engagementRate: 5.2,
        reach: 31400,
      },
      {
        id: "weekend-eats",
        name: "Weekend Eats",
        followers: 2890,
        engagementRate: 3.7,
        reach: 18100,
      },
      {
        id: "city-frames",
        name: "City Frames",
        followers: 5380,
        engagementRate: 4.9,
        reach: 36700,
      },
    ],
  },
  "90d": {
    period: "90d",
    followers: {
      total: 12480,
      changePercent: 18.6,
      trend: [16, 23, 21, 32, 29, 39, 36, 48, 44, 56, 53, 71],
    },
    engagement: {
      rate: 4.8,
      changePoints: 0.9,
      trend: [25, 32, 29, 43, 39, 50, 46, 58, 53, 66, 61, 77],
    },
    reach: {
      total: 246800,
      changePercent: 6.4,
      trend: [35, 42, 38, 51, 47, 58, 54, 67, 62, 73, 69, 84],
    },
    pageCount: 3,
    audienceActivity: {
      mostActiveTime: "6-9 PM",
      topDay: "Thursday",
      byDay: [
        { day: "Mon", value: 47 },
        { day: "Tue", value: 63 },
        { day: "Wed", value: 59 },
        { day: "Thu", value: 89 },
        { day: "Fri", value: 72 },
        { day: "Sat", value: 79 },
        { day: "Sun", value: 51 },
      ],
    },
    pages: [
      {
        id: "design-club",
        name: "Design Club",
        followers: 4210,
        engagementRate: 5.2,
        reach: 91300,
      },
      {
        id: "weekend-eats",
        name: "Weekend Eats",
        followers: 2890,
        engagementRate: 3.7,
        reach: 52600,
      },
      {
        id: "city-frames",
        name: "City Frames",
        followers: 5380,
        engagementRate: 4.9,
        reach: 102900,
      },
    ],
  },
};

const numberFormat = new Intl.NumberFormat("en-US");
const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const TrendChart = ({
  values,
  color,
  label,
}: {
  values: number[];
  color: string;
  label: string;
}) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = 12 + (index / (values.length - 1)) * 576;
      const y = 176 - ((value - min) / (max - min || 1)) * 142;
      return `${x},${y}`;
    })
    .join(" ");
  const plottedPoints = points.split(" ");
  const firstX = plottedPoints[0].split(",")[0];
  const lastX = plottedPoints[plottedPoints.length - 1].split(",")[0];

  return (
    <svg
      className="w-100 mt-2"
      viewBox="0 0 600 210"
      role="img"
      aria-label={label}
    >
      {[36, 82, 128, 176].map((y) => (
        <line
          key={y}
          x1="8"
          x2="592"
          y1={y}
          y2={y}
          stroke="var(--bs-border-color)"
          strokeDasharray="4 6"
        />
      ))}
      <polygon
        points={`${firstX},190 ${points} ${lastX},190`}
        fill={color}
        fillOpacity="0.09"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  href,
}: {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: IconType;
  href?: string;
}) => (
  <Card className="h-100 border">
    <CardBody className="d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-body-secondary small fw-semibold">{title}</span>
        <span className="icon-md rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center">
          <Icon aria-hidden="true" />
        </span>
      </div>
      <strong className="h3 mb-2">{value}</strong>
      {typeof change === "number" ? (
        <div className="small mt-auto">
          <span className={change >= 0 ? "text-success" : "text-danger"}>
            {change >= 0 ? (
              <BsArrowUpRight aria-hidden="true" />
            ) : (
              <BsArrowDownRight aria-hidden="true" />
            )}{" "}
            {Math.abs(change)}
            {changeLabel}
          </span>
          <span className="text-body-secondary ms-1">vs previous period</span>
        </div>
      ) : (
        <Link
          href={href ?? "/pages"}
          className="small mt-auto text-decoration-none"
        >
          View all pages
        </Link>
      )}
    </CardBody>
  </Card>
);

const InsightsPage = () => {
  const [period, setPeriod] = useState<InsightsPeriod>("30d");
  const { data, isError, isFetching } = useMyInsights(period);
  const dashboard = data ?? previewByPeriod[period];
  const isPreview = !data;

  return (
    <div className="vstack gap-4">
      <Card>
        <CardHeader className="bg-transparent border-0 pb-0">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h1 className="h4 mb-1">Insights</h1>
              <p className="text-body-secondary mb-0">
                Performance across your profile and pages
              </p>
            </div>
            <div
              className="btn-group"
              role="group"
              aria-label="Select reporting period"
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
        </CardHeader>
        <CardBody>
          {isPreview && (
            <div className="alert alert-warning py-2 mb-4" role="status">
              <strong>Preview data</strong>
              <span className="ms-2">
                {isError
                  ? "The live analytics endpoint is not available yet."
                  : isFetching
                    ? "Connecting to live analytics..."
                    : "These example figures will be replaced when live analytics are available."}
              </span>
            </div>
          )}
          <Row className="g-3">
            <Col sm={6} xl={3}>
              <MetricCard
                title="Followers"
                value={numberFormat.format(dashboard.followers.total)}
                change={dashboard.followers.changePercent}
                changeLabel="%"
                icon={BsPeople}
              />
            </Col>
            <Col sm={6} xl={3}>
              <MetricCard
                title="Engagement rate"
                value={`${dashboard.engagement.rate}%`}
                change={dashboard.engagement.changePoints}
                changeLabel=" pts"
                icon={BsPieChart}
              />
            </Col>
            <Col sm={6} xl={3}>
              <MetricCard
                title="Reach"
                value={numberFormat.format(dashboard.reach.total)}
                change={dashboard.reach.changePercent}
                changeLabel="%"
                icon={BsBullseye}
              />
            </Col>
            <Col sm={6} xl={3}>
              <MetricCard
                title="Pages"
                value={numberFormat.format(dashboard.pageCount)}
                icon={BsCollection}
                href="/pages"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <CardBody>
              <h2 className="h6 mb-0">Follower growth</h2>
              <p className="small text-body-secondary mb-0">
                Net followers over the selected period
              </p>
              <TrendChart
                values={dashboard.followers.trend}
                color="#0d6efd"
                label="Follower growth trend"
              />
              <div className="d-flex justify-content-between small text-body-secondary">
                <span>
                  {period === "7d"
                    ? "7 days ago"
                    : period === "30d"
                      ? "30 days ago"
                      : "90 days ago"}
                </span>
                <span>Today</span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <CardBody>
              <h2 className="h6 mb-0">Engagement over time</h2>
              <p className="small text-body-secondary mb-0">
                Interactions as a share of people reached
              </p>
              <TrendChart
                values={dashboard.engagement.trend}
                color="#20a889"
                label="Engagement rate trend"
              />
              <div className="d-flex justify-content-between small text-body-secondary">
                <span>
                  {period === "7d"
                    ? "7 days ago"
                    : period === "30d"
                      ? "30 days ago"
                      : "90 days ago"}
                </span>
                <span>Today</span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="h-100">
            <CardHeader className="bg-transparent d-flex align-items-center justify-content-between">
              <h2 className="h6 mb-0">Audience activity</h2>
              <span className="small text-body-secondary">By day</span>
            </CardHeader>
            <CardBody>
              <div className="d-flex gap-4 mb-4">
                <div>
                  <div className="small text-body-secondary">Most active</div>
                  <strong>{dashboard.audienceActivity.mostActiveTime}</strong>
                </div>
                <div>
                  <div className="small text-body-secondary">Top day</div>
                  <strong>{dashboard.audienceActivity.topDay}</strong>
                </div>
              </div>
              <div
                className="d-flex align-items-end justify-content-between gap-2"
                style={{ height: 104 }}
                aria-label="Audience activity by day of week"
              >
                {dashboard.audienceActivity.byDay.map(({ day, value }) => (
                  <div
                    key={day}
                    className="d-flex flex-column align-items-center gap-2 flex-grow-1 h-100 justify-content-end"
                  >
                    <div
                      className="w-100 rounded-top bg-primary"
                      style={{
                        height: `${value}%`,
                        minHeight: 8,
                        opacity: 0.35 + value / 140,
                      }}
                      title={`${day}: ${value}% activity`}
                    />
                    <span className="small text-body-secondary">{day}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="h-100">
            <CardHeader className="bg-transparent d-flex align-items-center justify-content-between">
              <h2 className="h6 mb-0">Your pages</h2>
              <Link href="/pages" className="small text-decoration-none">
                View all
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="small text-body-secondary">
                      <th scope="col" className="ps-3">
                        Page
                      </th>
                      <th scope="col">Followers</th>
                      <th scope="col">Engagement</th>
                      <th scope="col" className="pe-3">
                        Reach
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.pages.map((page) => (
                      <tr key={page.id}>
                        <th scope="row" className="ps-3 fw-semibold">
                          {page.name}
                        </th>
                        <td>{compactFormat.format(page.followers)}</td>
                        <td>{page.engagementRate}%</td>
                        <td className="pe-3">
                          {compactFormat.format(page.reach)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InsightsPage;
