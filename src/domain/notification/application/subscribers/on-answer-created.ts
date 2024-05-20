import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/domain-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(this.handle.bind(this), AnswerCreatedEvent.name);
	}

	private async handle({ answer }: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			answer.questionId.value,
		);

		if (question) {
			await this.sendNotification.execute({
				recipientId: question?.authorId.value,
				title: `Nova resposta "${question.title
					.substring(0, 40)
					.concat("...")}"`,
				content: answer.excerpt,
			});
		}
	}
}
