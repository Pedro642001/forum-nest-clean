import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/forum/make-answer";
import { makeQuestion } from "test/factories/forum/make-question";
import { AnswerAttachmentsRepositoryInMemory } from "test/repositories/forum/answer-attachments-repository-in-memory";
import { AnswersRepositoryInMemory } from "test/repositories/forum/answers-repository-in-memory";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let answerAttachmentsRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let answersRepositoryInMemory: AnswersRepositoryInMemory;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
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

		sut = new ChooseQuestionBestAnswerUseCase(
			questionsRepositoryInMemory,
			answersRepositoryInMemory,
		);
	});

	it("Should be able to choose the question best answer", async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		await answersRepositoryInMemory.create(newAnswer);
		await questionsRepositoryInMemory.create(newQuestion);

		const result = await sut.execute({
			answerId: newAnswer.id.value,
			authorId: newQuestion.authorId.value,
		});

		expect(result.isRight()).toBe(true);
		expect(questionsRepositoryInMemory.items[0].bestAnswerId).toEqual(
			newAnswer.id,
		);
	});

	it("Should not be able to choose the question best answer the another user", async () => {
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const newQuestion = makeQuestion({
			authorId: anotherUserId,
		});
		const newAnswer = makeAnswer({
			questionId: newQuestion.id,
		});

		await answersRepositoryInMemory.create(newAnswer);
		await questionsRepositoryInMemory.create(newQuestion);

		const result = await sut.execute({
			answerId: newAnswer.id.value,
			authorId: userId.value,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(NotAllowedError);
	});
});
