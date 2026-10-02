"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Alert, Card, CardBody, Form, Spinner } from "react-bootstrap";
import {
  BsArrowDownRight,
  BsArrowLeft,
  BsArrowUpRight,
  BsChatDots,
  BsFileEarmarkPost,
  BsHeart,
  BsPeople,
} from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/queryKeys";
import {
  getPagePerformance,
  type PagePerformancePeriod,
} from "@/features/pages/services/pagesApi";

const periodLabels: Record<PagePerformancePeriod, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const MetricCard = ({
  title,
  total,
  change,
  icon: Icon,
}: {
  title: string;
  total: number;
  change: number;
  icon: typeof BsPeople;
}) => (
  <Card className="h-100">
    <CardBody>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-body-secondary">{title}</span>
        <Icon className="text-primary" size={20} aria-hidden="true" />
      </div>
      <div className="h3 mb-2">{formatNumber(total)}</div>
      <small className={change >= 0 ? "text-success" : "text-danger"}>
        {change >= 0 ? (
          <BsArrowUpRight aria-hidden="true" className="me-1" />
        ) : (
          <BsArrowDownRight aria-hidden="true" className="me-1" />
        )}
        {change > 0 ? "+" : ""}
        {formatNumber(change)} vs previous period
      </small>
    </CardBody>
  </Card>
);

const PagePerformance = () => {
  const { id } = useParams<{ id: string }>();
  const [period, setPeriod] = useState<PagePerformancePeriod>("30d");
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.pagePerformance(id, period),
    queryFn: () => getPagePerformance(id, period),
    enabled: Boolean(id),
    retry: false,
  });
  const maxFollowers = Math.max(
    1,
    ...(data?.followers.trend.map((point) => point.total) ?? [1]),
  );

  return (
    <div>
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <Link
            href="/dashboard/my-pages"
            className="btn btn-outline-secondary btn-sm mb-3"
          >
            <BsArrowLeft aria-hidden="true" className="me-2" />
            Back to My Pages
          </Link>
          <h1 className="h4 mb-1">
            {data?.pageName
              ? `${data.pageName} performance`
              : "Page performance"}
          </h1>
          <p className="text-body-secondary mb-0">
            Posts, engagement, and audience growth.
          </p>
        </div>
        <Form.Group controlId="performance-period" className="mb-0">
          <Form.Label className="visually-hidden">Reporting period</Form.Label>
          <Form.Select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as PagePerformancePeriod)
            }
            aria-label="Reporting period"
          >
            {Object.entries(periodLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>

      {isLoading ? (
        <div className="d-flex align-items-center gap-2 py-5 text-body-secondary">
          <Spinner size="sm" role="status" />
          Loading page performance...
        </div>
      ) : isError || !data ? (
        <Alert variant="info">
          <Alert.Heading className="h6">
            Performance data unavailable
          </Alert.Heading>
          <p className="mb-0">
            This view needs a page performance endpoint from the API. Once it is
            available, this page will show post, engagement, and follower
            metrics.
          </p>
        </Alert>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <MetricCard
                title="Posts"
                total={data.posts.total}
                change={data.posts.change}
                icon={BsFileEarmarkPost}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <MetricCard
                title="Likes"
                total={data.likes.total}
                change={data.likes.change}
                icon={BsHeart}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <MetricCard
                title="Comments"
                total={data.comments.total}
                change={data.comments.change}
                icon={BsChatDots}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <MetricCard
                title="Followers"
                total={data.followers.total}
                change={data.followers.change}
                icon={BsPeople}
              />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <Card className="h-100">
                <CardBody>
                  <h2 className="h6 mb-1">Follower growth</h2>
                  <p className="small text-body-secondary mb-4">
                    {periodLabels[data.period]}
                  </p>
                  <div
                    className="d-flex align-items-end gap-2"
                    style={{ height: 180 }}
                    role="img"
                    aria-label="Follower count trend for the selected period"
                  >
                    {data.followers.trend.map((point) => (
                      <div
                        key={point.label}
                        className="d-flex flex-fill h-100 flex-column align-items-center justify-content-end gap-2"
                        title={`${point.label}: ${formatNumber(point.total)} followers`}
                      >
                        <div
                          className="w-100 rounded-top bg-primary"
                          style={{
                            height: `${Math.max(4, (point.total / maxFollowers) * 100)}%`,
                          }}
                        />
                        <small className="text-body-secondary text-truncate w-100 text-center">
                          {point.label}
                        </small>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className="col-lg-7">
              <Card className="h-100">
                <CardBody className="p-0">
                  <div className="px-3 py-3 border-bottom">
                    <h2 className="h6 mb-0">Top posts</h2>
                  </div>
                  {data.topPosts.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-info">
                          <tr>
                            <th className="ps-3">Post</th>
                            <th>Date</th>
                            <th>Likes</th>
                            <th className="pe-3">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="table-light">
                          {data.topPosts.map((post) => (
                            <tr key={post.id}>
                              <td
                                className="ps-3 text-truncate"
                                style={{ maxWidth: 220 }}
                                title={post.content}
                              >
                                {post.content}
                              </td>
                              <td>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </td>
                              <td>{formatNumber(post.likesCount)}</td>
                              <td className="pe-3">
                                {formatNumber(post.commentsCount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-body-secondary p-3 mb-0">
                      No posts were published during this period.
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PagePerformance;
