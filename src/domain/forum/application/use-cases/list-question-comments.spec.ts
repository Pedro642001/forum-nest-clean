import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/forum/make-question";
import { makeQuestionComment } from "test/factories/forum/make-question-comment";
import { QuestionCommentsRepositoryInMemory } from "test/repositories/forum/question-comments-repository-in-memory";
import { ListQuestionCommentsUseCase } from "./list-question-comments";

let questionCommentsRepositoryInMemory: QuestionCommentsRepositoryInMemory;
let sut: ListQuestionCommentsUseCase;

describe("List question comments", () => {
	beforeEach(() => {
		questionCommentsRepositoryInMemory =
			new QuestionCommentsRepositoryInMemory();

		sut = new ListQuestionCommentsUseCase(questionCommentsRepositoryInMemory);
	});

	it("Should be able to list question comments", async () => {
		const question = makeQuestion();

		for (let i = 0; i < 5; i++) {
			await questionCommentsRepositoryInMemory.create(
				makeQuestionComment({
					questionId: new UniqueEntityID("another id"),
				}),
			);
		}

		for (let i = 0; i < 5; i++) {
			await questionCommentsRepositoryInMemory.create(
				makeQuestionComment({
					questionId: question.id,
				}),
			);
		}

		const result = await sut.execute({
			questionId: question.id.value,
			page: 1,
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.questionComments.length).toEqual(5);
			expect(result.value.questionComments[0].questionId).toEqual(question.id);
			expect(result.value.questionComments[1].questionId).toEqual(question.id);
			expect(result.value.questionComments[2].questionId).toEqual(question.id);
			expect(result.value.questionComments[3].questionId).toEqual(question.id);
			expect(result.value.questionComments[4].questionId).toEqual(question.id);
		}
	});

	it("Should be able to list question comments by pagination", async () => {
		const question = makeQuestion();

		for (let i = 0; i < 22; i++) {
			await questionCommentsRepositoryInMemory.create(
				makeQuestionComment({
					questionId: question.id,
				}),
			);
		}

		const result = await sut.execute({
			questionId: question.id.value,
			page: 2,
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.questionComments.length).toEqual(2);
			expect(result.value.questionComments[0].questionId).toEqual(question.id);
			expect(result.value.questionComments[1].questionId).toEqual(question.id);
		}
	});
});
