import { makeQuestion } from "test/factories/forum/make-question";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionCommentsRepositoryInMemory } from "test/repositories/forum/question-comments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let questionCommentsRepositoryInMemory: QuestionCommentsRepositoryInMemory;
let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let sut: CommentOnQuestionUseCase;

describe("Comment on question", () => {
	beforeEach(() => {
		questionCommentsRepositoryInMemory =
			new QuestionCommentsRepositoryInMemory();
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);

		sut = new CommentOnQuestionUseCase(
			questionsRepositoryInMemory,
			questionCommentsRepositoryInMemory,
		);
	});

	it("Should be able to create a new comment on question", async () => {
		const question = makeQuestion();

		await questionsRepositoryInMemory.create(question);

		const result = await sut.execute({
			authorId: question.authorId.value,
			content: "new content",
			questionId: question.id.value,
		});

		expect(result.isRight()).toBe(true);
		expect(questionCommentsRepositoryInMemory.items[0].content).toEqual(
			"new content",
		);
	});
});
