import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/domain-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChooseEvent } from "@/domain/forum/enterprise/events/question-best-answer-choose-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnBestAnswerChooseCreated implements EventHandler {
	constructor(
		private answersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.handle.bind(this),
			QuestionBestAnswerChooseEvent.name,
		);
	}

	private async handle({
		bestAnswerId,
		question,
	}: QuestionBestAnswerChooseEvent) {
		const answer = await this.answersRepository.findById(bestAnswerId.value);

		if (answer) {
			await this.sendNotification.execute({
				recipientId: answer?.authorId.value,
				title: "Nova resposta foi escolhida",
				content: `A resposta que você enviou em "${question.title.substring(
					0,
					20,
				)}" foi escolhida pelo autor!`,
			});
		}
	}
}
