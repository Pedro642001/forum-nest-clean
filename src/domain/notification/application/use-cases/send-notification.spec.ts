import { NotificationsRepositoryInMemory } from "test/repositories/notification/notifications-respository-in-memory";
import { SendNotificationUseCase } from "./send-notification";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let notificationsRepositoryInMemory: NotificationsRepositoryInMemory;
let sut: SendNotificationUseCase;

describe("Send notification", () => {
	beforeEach(() => {
		notificationsRepositoryInMemory = new NotificationsRepositoryInMemory();
		sut = new SendNotificationUseCase(notificationsRepositoryInMemory);
	});

	it("Should be able to create a notification", async () => {
		const result = await sut.execute({
			recipientId: "1",
			content: "new content",
			title: "new title",
		});

		expect(result.isRight()).toBe(true);
		expect(notificationsRepositoryInMemory.items).toHaveLength(1);
		expect(notificationsRepositoryInMemory.items[0]).toMatchObject({
			recipientId: new UniqueEntityID("1"),
			content: "new content",
			title: "new title",
		});
	});
});
