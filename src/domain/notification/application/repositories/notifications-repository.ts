import { Notification } from "../../enterprise/entities/notification";

export interface NotificationsRepository {
	create(notification: Notification): Promise<void>;
	update(notification: Notification): Promise<void>;
	delete(notification: Notification): Promise<void>;
	findById(notificationId: string): Promise<Notification | null>;
}
