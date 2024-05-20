import { Either, left, right } from "@/core/either/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";

interface ReadNotificationInput {
	recipientId: string;
	notificationId: string;
}

type ReadNotificationOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{ notification: Notification }
>;

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		notificationId,
		recipientId,
	}: ReadNotificationInput): Promise<ReadNotificationOutput> {
		const notification =
			await this.notificationsRepository.findById(notificationId);

		if (!notification) {
			return left(new ResourceNotFoundError());
		}

		if (recipientId !== notification.recipientId.value) {
			return left(new NotAllowedError());
		}

		notification.read();

		await this.notificationsRepository.update(notification);

		return right({ notification });
	}
}
