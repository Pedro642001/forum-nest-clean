import { Either, right } from "@/core/either/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

export interface SendNotificationInput {
	recipientId: string;
	title: string;
	content: string;
}

export type SendNotificationOutput = Either<
	null,
	{ notification: Notification }
>;

export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		content,
		title,
	}: SendNotificationInput): Promise<SendNotificationOutput> {
		const notification = Notification.create({
			recipientId: new UniqueEntityID(recipientId),
			content,
			title,
		});

		await this.notificationsRepository.create(notification);

		return right({ notification });
	}
}
