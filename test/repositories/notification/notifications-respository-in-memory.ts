import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class NotificationsRepositoryInMemory implements NotificationsRepository {
  public items: Array<Notification> = [];

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);


    return;
  }

  async update(notification: Notification): Promise<void> {
    const notificationIndex = this.items.indexOf(notification);

    this.items[notificationIndex] = notification;
  }

  async delete(notification: Notification): Promise<void> {
    const notificationIndex = this.items.indexOf(notification);

    this.items.splice(notificationIndex, 1);
  }

  async findById(notificationId: string): Promise<Notification | null> {

    const notification = this.items.find((item) => item.id.value === notificationId);

    if (!notification) {
      return null;
    }

    return notification;
  }
};