import { apiService } from "@/lib/api";

export interface AppNotification {
  _id: string;
  targetRole: string;
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
}

export async function fetchNotifications(params?: {
  limit?: number;
  unreadOnly?: boolean;
}): Promise<AppNotification[]> {
  const searchParams = new URLSearchParams();
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.unreadOnly != null) {
    searchParams.set("unreadOnly", params.unreadOnly ? "true" : "false");
  }
  const q = searchParams.toString();
  const res = await apiService.get(`/notifications${q ? `?${q}` : ""}`);
  return res?.data ?? [];
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const res = await apiService.get("/notifications/unread-count");
  return res?.data?.count ?? 0;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiService.patch(`/notifications/${id}/read`, {});
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiService.patch("/notifications/read-all", {});
}
