import { NotificationsRepositoryInMemory } from "test/repositories/notification/notifications-respository-in-memory";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "test/factories/notification/make-notification";

let notificationsRepositoryInMemory: NotificationsRepositoryInMemory;
let sut: ReadNotificationUseCase;

describe("Read notification", () => {
	beforeEach(() => {
		notificationsRepositoryInMemory = new NotificationsRepositoryInMemory();
		sut = new ReadNotificationUseCase(notificationsRepositoryInMemory);
	});
	it("Should be able one recipient read her notification", async () => {
		const notification = makeNotification();
		notificationsRepositoryInMemory.create(notification);

		const result = await sut.execute({
			notificationId: notification.id.value,
			recipientId: notification.recipientId.value,
		});

		expect(result.isRight()).toBe(true);
		expect(notificationsRepositoryInMemory.items[0].readAt).toBeTruthy();
	});
});
