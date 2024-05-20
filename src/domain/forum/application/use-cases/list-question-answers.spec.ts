import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/forum/make-answer";
import { makeQuestion } from "test/factories/forum/make-question";
import { AnswerAttachmentsRepositoryInMemory } from "test/repositories/forum/answer-attachments-repository-in-memory";
import { AnswersRepositoryInMemory } from "test/repositories/forum/answers-repository-in-memory";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { ListQuestionAnswersUseCase } from "./list-question-answers";

let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let answerAttachmentsRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let answersRepositoryInMemory: AnswersRepositoryInMemory;
let sut: ListQuestionAnswersUseCase;

describe("List question answers", () => {
	beforeEach(() => {
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);
		answerAttachmentsRepositoryInMemory =
			new AnswerAttachmentsRepositoryInMemory();
		answersRepositoryInMemory = new AnswersRepositoryInMemory(
			answerAttachmentsRepositoryInMemory,
		);

		sut = new ListQuestionAnswersUseCase(
			answersRepositoryInMemory,
			questionsRepositoryInMemory,
		);
	});

	it("Should be able to list question answers", async () => {
		const question = makeQuestion();

		await questionsRepositoryInMemory.create(question);

		for (let i = 0; i < 5; i++) {
			await answersRepositoryInMemory.create(
				makeAnswer({
					questionId: new UniqueEntityID("another id"),
				}),
			);
		}

		for (let i = 0; i < 5; i++) {
			await answersRepositoryInMemory.create(
				makeAnswer({
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
			expect(result.value?.answers.length).toEqual(5);
			expect(result.value?.answers[0].questionId).toEqual(question.id);
			expect(result.value?.answers[1].questionId).toEqual(question.id);
			expect(result.value?.answers[2].questionId).toEqual(question.id);
			expect(result.value?.answers[3].questionId).toEqual(question.id);
			expect(result.value?.answers[4].questionId).toEqual(question.id);
		}
	});

	it("Should be able to list question answers by pagination", async () => {
		const question = makeQuestion();

		await questionsRepositoryInMemory.create(question);

		for (let i = 0; i < 22; i++) {
			await answersRepositoryInMemory.create(
				makeAnswer({
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
			expect(result.value.answers.length).toEqual(2);
			expect(result.value.answers[0].questionId).toEqual(question.id);
			expect(result.value.answers[1].questionId).toEqual(question.id);
		}
	});
});
