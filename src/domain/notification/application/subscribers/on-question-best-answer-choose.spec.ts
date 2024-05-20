import { AnswerAttachmentsRepositoryInMemory } from "test/repositories/forum/answer-attachments-repository-in-memory";
import { AnswersRepositoryInMemory } from "test/repositories/forum/answers-repository-in-memory";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { NotificationsRepositoryInMemory } from "test/repositories/notification/notifications-respository-in-memory";
import {
	SendNotificationInput,
	SendNotificationOutput,
	SendNotificationUseCase,
} from "../use-cases/send-notification";
import { OnBestAnswerChooseCreated } from "./on-question-best-answer-choose";
import { MockInstance } from "vitest";
import { makeQuestion } from "test/factories/forum/make-question";
import { makeAnswer } from "test/factories/forum/make-answer";

let questionAttachmentRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let answersAttachmentRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let answersRepositoryInMemory: AnswersRepositoryInMemory;
let notificationsRepositoryInMemory: NotificationsRepositoryInMemory;

let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: MockInstance<
	[SendNotificationInput],
	Promise<SendNotificationOutput>
>;

describe("On question best answer choose", () => {
	beforeEach(() => {
		questionAttachmentRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentRepositoryInMemory,
		);

		answersAttachmentRepositoryInMemory =
			new AnswerAttachmentsRepositoryInMemory();
		answersRepositoryInMemory = new AnswersRepositoryInMemory(
			answersAttachmentRepositoryInMemory,
		);

		notificationsRepositoryInMemory = new NotificationsRepositoryInMemory();

		sendNotificationUseCase = new SendNotificationUseCase(
			notificationsRepositoryInMemory,
		);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

		new OnBestAnswerChooseCreated(
			answersRepositoryInMemory,
			sendNotificationUseCase,
		);
	});

	it("Should be able to send a notification when an answer is chosen as the best", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});

		await questionsRepositoryInMemory.create(question);
		await answersRepositoryInMemory.create(answer);

		question.bestAnswerId = answer.id;

		await questionsRepositoryInMemory.update(question);

		expect(notificationsRepositoryInMemory.items).toHaveLength(1);
		expect(sendNotificationExecuteSpy).toHaveBeenCalled();
	});
});
