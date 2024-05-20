import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/forum/make-answer";
import { makeAnswerAttachment } from "test/factories/forum/make-answer-attachment";
import { AnswerAttachmentsRepositoryInMemory } from "test/repositories/forum/answer-attachments-repository-in-memory";
import { AnswersRepositoryInMemory } from "test/repositories/forum/answers-repository-in-memory";
import { DeleteAnswerUseCase } from "./delete-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let answersRepositoryInMemory: AnswersRepositoryInMemory;
let answerAttachmentsRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let deleteAnswerUseCase: DeleteAnswerUseCase;

describe("Delete answer", () => {
	beforeEach(() => {
		answerAttachmentsRepositoryInMemory =
			new AnswerAttachmentsRepositoryInMemory();
		answersRepositoryInMemory = new AnswersRepositoryInMemory(
			answerAttachmentsRepositoryInMemory,
		);
		deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepositoryInMemory);
	});
	it("Should be able to delete an answer", async () => {
		const answerId = new UniqueEntityID();
		const authorId = new UniqueEntityID();

		const answer = makeAnswer({ authorId }, answerId);

		await answerAttachmentsRepositoryInMemory.create(
			makeAnswerAttachment({
				answerId: answer.id,
				attachmentId: new UniqueEntityID("1"),
			}),
		);

		await answerAttachmentsRepositoryInMemory.create(
			makeAnswerAttachment({
				answerId: answer.id,
				attachmentId: new UniqueEntityID("2"),
			}),
		);

		await answersRepositoryInMemory.create(answer);

		await deleteAnswerUseCase.execute({
			answerId: answerId.value,
			authorId: authorId.value,
		});

		expect(answersRepositoryInMemory.items).toHaveLength(0);
		expect(answerAttachmentsRepositoryInMemory.items).toHaveLength(0);
	});

	it("Should not be able to delete an answer from another user", async () => {
		const answerId = new UniqueEntityID();
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const answer = makeAnswer({ authorId: anotherUserId }, answerId);

		await answersRepositoryInMemory.create(answer);

		const result = await deleteAnswerUseCase.execute({
			answerId: answerId.value,
			authorId: userId.value,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(NotAllowedError);
	});
});
