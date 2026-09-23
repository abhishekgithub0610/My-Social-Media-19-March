"use client";

import { useState } from "react";

import { timeSince } from "@/shared/utils/formatters";

import clsx from "clsx";

import Image from "next/image";
import Link from "next/link";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";

import { BsBellFill, BsCheck2 } from "react-icons/bs";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//sfdf
import {
  NotificationDto,
  NotificationType,
} from "@/features/notification/types/notification";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/notification/services/notificationApi";

const AVATAR_SIZE = 44;

// ==========================================================
// UNCHANGED / EXISTING IDEA
// Notification sentence is generated from structured data.
// ==========================================================

const getNotificationText = (notification: NotificationDto): string => {
  const actorName = notification.actor?.name ?? "Someone";

  switch (notification.type) {
    case NotificationType.PostLiked:
      return notification.pageName
        ? `${actorName} liked your post on ${notification.pageName} page`
        : `${actorName} liked your post`;

    case NotificationType.PostCommented:
      return notification.pageName
        ? `${actorName} commented on your post on ${notification.pageName} page`
        : `${actorName} commented on your post`;

    case NotificationType.CommentLiked:
      return `${actorName} liked your comment`;

    case NotificationType.UserFollowed:
      return `${actorName} started following you`;

    case NotificationType.PageFollowed:
      return notification.pageName
        ? `${actorName} followed ${notification.pageName}`
        : `${actorName} followed your page`;

    case NotificationType.Mentioned:
      return `${actorName} mentioned you`;

    case NotificationType.FriendRequest:
      return `${actorName} sent you a friend request`;

    default:
      return "New notification";
  }
};

type NotificationFilter = "all" | "unread";

const NotificationDropdown = () => {
  const queryClient = useQueryClient();

  // ========================================================
  // NEW
  // Controls All / Unread tabs.
  // ========================================================

  const [filter, setFilter] = useState<NotificationFilter>("all");

  // ========================================================
  // CHANGED
  // Query key includes filter.
  //
  // This means TanStack Query separately caches:
  // ["notifications", "all"]
  // ["notifications", "unread"]
  // ========================================================

  const {
    data: notificationResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", filter],

    queryFn: () => getNotifications(1, 10, filter === "unread"),

    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const notifications = notificationResponse?.result ?? [];

  // ========================================================
  // EXISTING
  // Real unread count from backend.
  // ========================================================

  const { data: unreadCountResponse } = useQuery({
    queryKey: ["notification-unread-count"],

    queryFn: getUnreadNotificationCount,

    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const unreadCount = unreadCountResponse?.result?.count ?? 0;

  // ========================================================
  // NEW
  // Helper because both mutations need to refresh the same
  // notification-related queries.
  // ========================================================

  const refreshNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["notification-unread-count"],
      }),
    ]);
  };

  // ========================================================
  // EXISTING
  // Mark individual notification read.
  // ========================================================

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: refreshNotifications,
  });

  // ========================================================
  // EXISTING
  // Mark every notification read.
  // ========================================================

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: refreshNotifications,
  });

  // ========================================================
  // NEW
  // Dedicated ✓ action.
  //
  // stopPropagation is important because later clicking the
  // row itself can navigate to the post/comment.
  // ========================================================

  const handleMarkAsRead = (
    event: React.MouseEvent,
    notification: NotificationDto,
  ) => {
    event.stopPropagation();

    if (notification.isRead || markAsReadMutation.isPending) {
      return;
    }

    markAsReadMutation.mutate(notification.id);
  };

  return (
    <Dropdown
      as="li"
      autoClose="outside"
      className="nav-item ms-2"
      drop="down"
      align="end"
    >
      {/* ===================================================
          CHANGED
          Numeric unread badge.
         =================================================== */}

      <DropdownToggle className="content-none nav-link bg-light icon-md btn btn-light p-0 position-relative">
        <BsBellFill size={15} />

        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{
              fontSize: "9px",
              minWidth: "18px",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownToggle>

      {/* ===================================================
          CHANGED
          Slightly richer notification-center dropdown.
         =================================================== */}

      <DropdownMenu
        className="dropdown-animation dropdown-menu-end p-0 shadow-lg border-0"
        style={{
          width: "390px",
          maxWidth: "95vw",
        }}
      >
        <Card className="border-0">
          {/* =================================================
              CHANGED
              Header + mark all read.
             ================================================= */}

          <CardHeader className="border-0 bg-body pt-3 px-3 pb-2">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold">Notifications</h5>

              {unreadCount > 0 && (
                <Button
                  variant="link"
                  className="small p-0 text-decoration-none"
                  disabled={markAllAsReadMutation.isPending}
                  onClick={() => markAllAsReadMutation.mutate()}
                >
                  {markAllAsReadMutation.isPending
                    ? "Marking..."
                    : "Mark all as read"}
                </Button>
              )}
            </div>

            {/* ===============================================
                NEW
                All / Unread filter tabs.
               =============================================== */}

            <div className="d-flex gap-2 mt-3">
              <Button
                size="sm"
                variant={filter === "all" ? "primary" : "light"}
                className="rounded-pill px-3"
                onClick={() => setFilter("all")}
              >
                All
              </Button>

              <Button
                size="sm"
                variant={filter === "unread" ? "primary" : "light"}
                className="rounded-pill px-3"
                onClick={() => setFilter("unread")}
              >
                Unread
                {unreadCount > 0 && <span className="ms-1">{unreadCount}</span>}
              </Button>
            </div>
          </CardHeader>

          <CardBody
            className="p-0"
            style={{
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {/* UNCHANGED IDEA — loading */}

            {isLoading && (
              <div className="text-center p-4 text-muted small">
                Loading notifications...
              </div>
            )}

            {/* UNCHANGED IDEA — error */}

            {isError && (
              <div className="text-center p-4 text-danger small">
                Unable to load notifications
              </div>
            )}

            {/* =================================================
                CHANGED
                Better empty message based on active tab.
               ================================================= */}

            {!isLoading && !isError && notifications.length === 0 && (
              <div className="text-center py-5 px-3">
                <BsBellFill size={25} className="text-muted mb-2" />

                <p className="mb-0 fw-semibold">
                  {filter === "unread"
                    ? "You're all caught up"
                    : "No notifications yet"}
                </p>

                <small className="text-muted">
                  {filter === "unread"
                    ? "You have no unread notifications."
                    : "New activity will appear here."}
                </small>
              </div>
            )}

            {!isLoading && !isError && notifications.length > 0 && (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    // =====================================
                    // NEW
                    // Strong visual distinction:
                    //
                    // unread → subtle background
                    // read   → normal background
                    // =====================================

                    className={clsx(
                      "d-flex align-items-start position-relative px-3 py-3 border-bottom",
                      {
                        "bg-light": !notification.isRead,
                      },
                    )}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {/* ===================================
                            NEW
                            Explicit unread indicator.
                           =================================== */}

                    {!notification.isRead && (
                      <span
                        className="position-absolute bg-primary rounded-circle"
                        style={{
                          width: "8px",
                          height: "8px",
                          left: "5px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}

                    {/* ===================================
                            CHANGED
                            Existing API media convention.
                           =================================== */}

                    <div className="avatar flex-shrink-0">
                      {notification.actor?.avatar ? (
                        <Image
                          className="avatar-img rounded-circle"
                          src={`http://localhost:7120/${notification.actor.avatar}`}
                          alt={notification.actor.name}
                          width={AVATAR_SIZE}
                          height={AVATAR_SIZE}
                          unoptimized
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: AVATAR_SIZE,
                            height: AVATAR_SIZE,
                          }}
                        >
                          {notification.actor?.name?.charAt(0).toUpperCase() ??
                            "?"}
                        </div>
                      )}
                    </div>

                    {/* ===================================
                            CHANGED
                            Notification body.
                           =================================== */}

                    <div className="ms-3 flex-grow-1 pe-2">
                      <p
                        className={clsx("small mb-1", {
                          "fw-semibold": !notification.isRead,
                        })}
                      >
                        {getNotificationText(notification)}
                      </p>

                      <small
                        className={clsx({
                          "text-primary fw-semibold": !notification.isRead,

                          "text-muted": notification.isRead,
                        })}
                      >
                        {timeSince(notification.createdAt)}
                      </small>
                    </div>

                    {/* ===================================
                            NEW
                            ✓ button only appears for unread.

                            User can clear notification without
                            being forced to open the post.
                           =================================== */}

                    {!notification.isRead && (
                      <Button
                        variant="light"
                        size="sm"
                        title="Mark as read"
                        aria-label="Mark notification as read"
                        className="rounded-circle p-1 flex-shrink-0"
                        disabled={markAsReadMutation.isPending}
                        onClick={(event) =>
                          handleMarkAsRead(event, notification)
                        }
                      >
                        <BsCheck2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>

          {/* =================================================
              CHANGED
              Use an actual notifications route eventually.
             ================================================= */}

          <CardFooter className="text-center bg-body border-0 py-3">
            <Link
              href="/notifications"
              className="btn btn-primary-soft btn-sm w-100"
            >
              See all notifications
            </Link>
          </CardFooter>
        </Card>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;
