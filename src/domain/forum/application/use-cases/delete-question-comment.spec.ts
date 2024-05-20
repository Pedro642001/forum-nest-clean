import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { makeQuestion } from "test/factories/forum/make-question";
import { makeQuestionComment } from "test/factories/forum/make-question-comment";
import { QuestionCommentsRepositoryInMemory } from "test/repositories/forum/question-comments-repository-in-memory";

let questionCommentRepositoryInMemory: QuestionCommentsRepositoryInMemory;
let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment", () => {
	beforeEach(() => {
		questionCommentRepositoryInMemory =
			new QuestionCommentsRepositoryInMemory();
		sut = new DeleteQuestionCommentUseCase(questionCommentRepositoryInMemory);
	});

	it("Should be able to delete question comment", async () => {
		const question = makeQuestion();
		const questionComment = makeQuestionComment({
			questionId: question.id,
		});

		await questionCommentRepositoryInMemory.create(questionComment);
		expect(questionCommentRepositoryInMemory.items.length).toEqual(1);

		await sut.execute({
			questionCommentId: questionComment.id.value,
			authorId: questionComment.authorId.value,
		});

		expect(questionCommentRepositoryInMemory.items.length).toEqual(0);
	});

	it("Should not be able to delete an question comment from another user", async () => {
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const answerComment = makeQuestionComment({ authorId: anotherUserId });

		await questionCommentRepositoryInMemory.create(answerComment);

		const result = await sut.execute({
			questionCommentId: answerComment.id.value,
			authorId: userId.value,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(NotAllowedError);
	});
});
