import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerCommentsRepositoryInMemory } from "test/repositories/forum/answer-comments-repository-in-memory";
import { makeAnswerComment } from "test/factories/forum/make-answer-comment";

let answerCommentRepositoryInMemory: AnswerCommentsRepositoryInMemory;
let sut: DeleteAnswerCommentUseCase;

describe("Delete answer comment", () => {
	beforeEach(() => {
		answerCommentRepositoryInMemory = new AnswerCommentsRepositoryInMemory();
		sut = new DeleteAnswerCommentUseCase(answerCommentRepositoryInMemory);
	});

	it("Should be able to delete answer comment", async () => {
		const answerComment = makeAnswerComment({});

		await answerCommentRepositoryInMemory.create(answerComment);
		expect(answerCommentRepositoryInMemory.items.length).toEqual(1);

		await sut.execute({
			authorId: answerComment.authorId.value,
			answerCommentId: answerComment.id.value,
		});

		expect(answerCommentRepositoryInMemory.items.length).toEqual(0);
	});

	it("Should not be able to delete an answer comment from another user", async () => {
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const answerComment = makeAnswerComment({ authorId: anotherUserId });

		await answerCommentRepositoryInMemory.create(answerComment);

		const result = await sut.execute({
			answerCommentId: answerComment.id.value,
			authorId: userId.value,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
