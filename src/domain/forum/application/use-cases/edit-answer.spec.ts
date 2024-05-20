import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/forum/make-answer";
import { makeAnswerAttachment } from "test/factories/forum/make-answer-attachment";
import { AnswerAttachmentsRepositoryInMemory } from "test/repositories/forum/answer-attachments-repository-in-memory";
import { AnswersRepositoryInMemory } from "test/repositories/forum/answers-repository-in-memory";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let answerAttachmentsRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let answersRepositoryInMemory: AnswersRepositoryInMemory;
let answerAttachmentRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let editAnswerUseCase: EditAnswerUseCase;

describe("Edit answer", () => {
	beforeEach(() => {
		answerAttachmentsRepositoryInMemory =
			new AnswerAttachmentsRepositoryInMemory();
		answersRepositoryInMemory = new AnswersRepositoryInMemory(
			answerAttachmentsRepositoryInMemory,
		);
		answerAttachmentRepositoryInMemory =
			new AnswerAttachmentsRepositoryInMemory();
		editAnswerUseCase = new EditAnswerUseCase(
			answerAttachmentRepositoryInMemory,
			answersRepositoryInMemory,
		);
	});
	it("Should be able to edit a answer", async () => {
		const answer = makeAnswer();

		await answersRepositoryInMemory.create(answer);

		await answerAttachmentRepositoryInMemory.create(
			makeAnswerAttachment({
				answerId: answer.id,
				attachmentId: new UniqueEntityID("1"),
			}),
		);

		await answerAttachmentRepositoryInMemory.create(
			makeAnswerAttachment({
				answerId: answer.id,
				attachmentId: new UniqueEntityID("2"),
			}),
		);

		await editAnswerUseCase.execute({
			authorId: answer.authorId.value,
			answerId: answer.id.value,
			content: "new content",
			attachmentIds: ["1"],
		});

		expect(answersRepositoryInMemory.items[0]).toMatchObject({
			content: "new content",
		});

		expect(
			answersRepositoryInMemory.items[0].attachments.currentItems,
		).toHaveLength(1);
		expect(answersRepositoryInMemory.items[0].attachments.currentItems).toEqual(
			[expect.objectContaining({ attachmentId: new UniqueEntityID("1") })],
		);
	});

	it("Should not be able to edit an answer from another user", async () => {
		const answerId = new UniqueEntityID();
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const answer = makeAnswer({ authorId: anotherUserId }, answerId);

		await answersRepositoryInMemory.create(answer);

		const result = await editAnswerUseCase.execute({
			answerId: answerId.value,
			authorId: userId.value,
			content: "new content",
			attachmentIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(NotAllowedError);
	});
});
