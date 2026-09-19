import { ApiResponseResult } from "@/types/api";

import {
  NotificationDto,
  UnreadNotificationCountDto,
} from "@/features/notification/types/notification";
///////jhhhhhhhv
import { baseClient } from "@/shared/api/baseClient";
export const getNotifications = async (
  page: number = 1,
  pageSize: number = 10,
  unreadOnly: boolean = false,
): Promise<ApiResponseResult<NotificationDto[]>> => {
  const response = await baseClient.get(
    `/notifications?page=${page}&pageSize=${pageSize}&unreadOnly=${unreadOnly}`,
  );

  return response.data;
};

export const getUnreadNotificationCount = async (): Promise<
  ApiResponseResult<UnreadNotificationCountDto>
> => {
  const response = await baseClient.get(`/notifications/unread-count`);

  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await baseClient.patch(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await baseClient.patch(`/notifications/read-all`);

  return response.data;
};
