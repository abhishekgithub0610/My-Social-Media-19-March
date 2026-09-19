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

// "use client";

// import { timeSince } from "@/shared/utils/formatters";
// import clsx from "clsx";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardFooter,
//   CardHeader,
//   Dropdown,
//   DropdownMenu,
//   DropdownToggle,
// } from "react-bootstrap";
// import { BsBellFill } from "react-icons/bs";

// // ==========================================================
// // CHANGED
// // Using TanStack Query to load real notifications
// // ==========================================================

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   NotificationDto,
//   NotificationType,
// } from "@/features/notification/types/notification";

// import {
//   getNotifications,
//   getUnreadNotificationCount,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// } from "@/features/notification/services/notificationApi";
// const AVATAR_SIZE = 40;

// // ==========================================================
// // CHANGED
// // Converts structured notification data from backend
// // into text displayed in UI.
// //
// // We intentionally do NOT store this text in SQL Server.
// // ==========================================================

// const getNotificationText = (notification: NotificationDto): string => {
//   const actorName = notification.actor?.name ?? "Someone";

//   switch (notification.type) {
//     case NotificationType.PostLiked:
//       return notification.pageName
//         ? `${actorName} liked your post on ${notification.pageName} page`
//         : `${actorName} liked your post`;

//     case NotificationType.PostCommented:
//       return notification.pageName
//         ? `${actorName} commented on your post on ${notification.pageName} page`
//         : `${actorName} commented on your post`;

//     case NotificationType.CommentLiked:
//       return `${actorName} liked your comment`;

//     case NotificationType.UserFollowed:
//       return `${actorName} started following you`;

//     case NotificationType.PageFollowed:
//       return notification.pageName
//         ? `${actorName} followed ${notification.pageName}`
//         : `${actorName} followed your page`;

//     case NotificationType.Mentioned:
//       return `${actorName} mentioned you`;

//     case NotificationType.FriendRequest:
//       return `${actorName} sent you a friend request`;

//     default:
//       return "New notification";
//   }
// };

// const NotificationDropdown = () => {
//   // ========================================================
//   // CHANGED
//   // Replaces mockNotifications with real API data
//   // ========================================================

//   // const {
//   //   data: notificationResponse,
//   //   isLoading,
//   //   isError,
//   // } = useQuery({
//   //   queryKey: ["notifications"],
//   //   queryFn: () => getNotifications(1, 10),
//   // });

//   const {
//     data: notificationResponse,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: () => getNotifications(1, 10),

//     // Notification data remains fresh for 1 minute.
//     staleTime: 60 * 1000,

//     // Don't make another request whenever browser/tab gets focus.
//     refetchOnWindowFocus: false,

//     // Don't refetch just because this component mounts again
//     // while cached data already exists.
//     refetchOnMount: false,

//     // Don't repeatedly retry if API request fails.
//     retry: 1,
//   });

//   const { data: unreadCountResponse } = useQuery({
//     queryKey: ["notification-unread-count"],
//     queryFn: getUnreadNotificationCount,

//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//     retry: 1,
//   });
//   // ========================================================
//   // CHANGED
//   // ApiResponseResult wraps our actual notification array.
//   // ========================================================

//   const notifications = notificationResponse?.result ?? [];

//   // ========================================================
//   // CHANGED
//   // Temporary unread count.
//   //
//   // IMPORTANT:
//   // This only counts unread notifications among the
//   // notifications currently fetched.
//   //
//   // Later we will replace this with:
//   // GET /notifications/unread-count
//   // ========================================================

//   const unreadCount = unreadCountResponse?.result?.count ?? 0;

//   const queryClient = useQueryClient();

//   const markAsReadMutation = useMutation({
//     mutationFn: markNotificationAsRead,

//     onSuccess: async () => {
//       await Promise.all([
//         queryClient.invalidateQueries({
//           queryKey: ["notifications"],
//         }),

//         queryClient.invalidateQueries({
//           queryKey: ["notification-unread-count"],
//         }),
//       ]);
//     },
//   });

//   const handleNotificationClick = (notification: NotificationDto) => {
//     if (!notification.isRead) {
//       markAsReadMutation.mutate(notification.id);
//     }
//   };

//   const markAllAsReadMutation = useMutation({
//     mutationFn: markAllNotificationsAsRead,

//     onSuccess: async () => {
//       await Promise.all([
//         queryClient.invalidateQueries({
//           queryKey: ["notifications"],
//         }),

//         queryClient.invalidateQueries({
//           queryKey: ["notification-unread-count"],
//         }),
//       ]);
//     },
//   });
//   return (
//     // ======================================================
//     // UNCHANGED
//     // Existing dropdown configuration/design
//     // ======================================================

//     <Dropdown
//       as="li"
//       autoClose="outside"
//       className="nav-item ms-2"
//       drop="down"
//       align="end"
//     >
//       <DropdownToggle className="content-none nav-link bg-light icon-md btn btn-light p-0 position-relative">
//         <BsBellFill size={15} />

//         {unreadCount > 0 && (
//           <span
//             className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
//             style={{
//               fontSize: "10px",
//               minWidth: "18px",
//             }}
//           >
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}
//       </DropdownToggle>

//       {/* ===================================================
//           UNCHANGED
//           Existing dropdown styling
//          =================================================== */}

//       <DropdownMenu className="dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg border-0">
//         <Card>
//           <CardHeader className="d-flex justify-content-between align-items-center">
//             <h6 className="m-0">
//               Notifications{" "}
//               {/* ============================================
//                   CHANGED
//                   Removed hard-coded "4 new".
//                  ============================================ */}
//               {unreadCount > 0 && (
//                 <span className="badge bg-danger bg-opacity-10 text-danger ms-2">
//                   {unreadCount} new
//                 </span>
//               )}
//             </h6>

//             {/* ==============================================
//                 UNCHANGED FOR NOW
//                 Later this will call mark-all-as-read.
//                ============================================== */}

//             {unreadCount > 0 && (
//               <Button
//                 variant="link"
//                 className="small p-0 text-decoration-none"
//                 disabled={markAllAsReadMutation.isPending}
//                 onClick={() => markAllAsReadMutation.mutate()}
//               >
//                 {markAllAsReadMutation.isPending
//                   ? "Marking..."
//                   : "Mark all as read"}
//               </Button>
//             )}
//           </CardHeader>

//           <CardBody className="p-0">
//             {/* ==============================================
//                 CHANGED
//                 Handle loading state.
//                ============================================== */}

//             {isLoading && (
//               <div className="text-center p-4 text-muted small">
//                 Loading notifications...
//               </div>
//             )}

//             {/* ==============================================
//                 CHANGED
//                 Handle API error.
//                ============================================== */}

//             {isError && (
//               <div className="text-center p-4 text-danger small">
//                 Unable to load notifications
//               </div>
//             )}

//             {/* ==============================================
//                 CHANGED
//                 Empty state.
//                ============================================== */}

//             {!isLoading && !isError && notifications.length === 0 && (
//               <div className="text-center p-4 text-muted small">
//                 No notifications yet
//               </div>
//             )}

//             {/* ==============================================
//                 CHANGED
//                 Real notification list instead of mocks.
//                ============================================== */}

//             {!isLoading && !isError && notifications.length > 0 && (
//               <ul className="list-group list-group-flush list-unstyled p-2">
//                 {notifications.slice(0, 4).map((notification) => (
//                   <li key={notification.id}>
//                     {/* ==================================
//                             UNCHANGED
//                             Existing notification row styling.
//                            ================================== */}

//                     <div
//                       role="button"
//                       onClick={() => handleNotificationClick(notification)}
//                       className={clsx(
//                         "rounded d-sm-flex border-0 mb-1 px-3 py-md-3 py-2 position-relative",
//                         {
//                           "badge-unread": !notification.isRead,
//                         },
//                       )}
//                     >
//                       {/* ================================
//                               CHANGED
//                               Avatar now comes from Actor.
//                              ================================ */}

//                       <div className="avatar text-center d-md-block d-none">
//                         {notification.actor?.avatar ? (
//                           <Image
//                             className="avatar-img rounded-circle"
//                             src={`http://localhost:7120/${notification.actor.avatar}`}
//                             alt={notification.actor.name}
//                             width={AVATAR_SIZE}
//                             height={AVATAR_SIZE}
//                             unoptimized
//                           />
//                         ) : (
//                           // =============================
//                           // CHANGED
//                           // Fallback avatar uses first
//                           // letter of actor's name.
//                           // =============================

//                           <div className="avatar-img rounded-circle bg-primary">
//                             <span className="text-white position-absolute top-50 start-50 translate-middle fw-bold">
//                               {notification.actor?.name
//                                 ?.charAt(0)
//                                 .toUpperCase() ?? "?"}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="mx-sm-3 my-2 my-sm-0 flex-grow-1">
//                         {/* ==============================
//                                 CHANGED
//                                 notification.title removed.
//                                 Text is generated from the
//                                 structured notification.
//                                ============================== */}

//                         <p className="small mb-2">
//                           {getNotificationText(notification)}
//                         </p>

//                         {/* ==============================
//                                 REMOVED FOR NOW

//                                 Old:
//                                 notification.description

//                                 We don't currently have a
//                                 description in NotificationDto.
//                                ============================== */}

//                         {/* ==============================
//                                 REMOVED FOR NOW

//                                 Old friend request Accept /
//                                 Delete buttons depended on the
//                                 mock `isFriendRequest` field.

//                                 We'll add actions properly when
//                                 FriendRequest notifications are
//                                 implemented in the backend.
//                                ============================== */}
//                       </div>

//                       {/* ================================
//                               CHANGED
//                               Backend now supplies CreatedAt
//                               instead of mock "2m" / "5m".
//                              ================================ */}

//                       <p className="small text-nowrap d-md-block d-none">
//                         {timeSince(notification.createdAt).slice(0, 5)}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardBody>

//           {/* ================================================
//               UNCHANGED FOR NOW
//               Later this should navigate to /notifications.
//              ================================================ */}

//           <CardFooter className="text-center">
//             <Button variant="primary-soft" size="sm">
//               See all incoming activity
//             </Button>
//           </CardFooter>
//         </Card>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };

// export default NotificationDropdown;
