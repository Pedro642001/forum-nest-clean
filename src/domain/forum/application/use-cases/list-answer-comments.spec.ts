import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/forum/make-answer";
import { makeAnswerComment } from "test/factories/forum/make-answer-comment";
import { AnswerCommentsRepositoryInMemory } from "test/repositories/forum/answer-comments-repository-in-memory";
import { ListAnswerCommentsUseCase } from "./list-answer-comments";

let answerCommentsRepositoryInMemory: AnswerCommentsRepositoryInMemory;
let sut: ListAnswerCommentsUseCase;

describe("List answer comments", () => {
	beforeEach(() => {
		answerCommentsRepositoryInMemory = new AnswerCommentsRepositoryInMemory();

		sut = new ListAnswerCommentsUseCase(answerCommentsRepositoryInMemory);
	});

	it("Should be able to list answer comments", async () => {
		const answer = makeAnswer();

		for (let i = 0; i < 5; i++) {
			await answerCommentsRepositoryInMemory.create(
				makeAnswerComment({
					answerId: new UniqueEntityID("another id"),
				}),
			);
		}

		for (let i = 0; i < 5; i++) {
			await answerCommentsRepositoryInMemory.create(
				makeAnswerComment({
					answerId: answer.id,
				}),
			);
		}

		const result = await sut.execute({
			answerId: answer.id.value,
			page: 1,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments.length).toEqual(5);
		expect(result.value?.answerComments[0].answerId).toEqual(answer.id);
		expect(result.value?.answerComments[1].answerId).toEqual(answer.id);
		expect(result.value?.answerComments[2].answerId).toEqual(answer.id);
		expect(result.value?.answerComments[3].answerId).toEqual(answer.id);
		expect(result.value?.answerComments[4].answerId).toEqual(answer.id);
	});

	it("Should be able to list answer comments by pagination", async () => {
		const answer = makeAnswer();

		for (let i = 0; i < 22; i++) {
			await answerCommentsRepositoryInMemory.create(
				makeAnswerComment({
					answerId: answer.id,
				}),
			);
		}

		const result = await sut.execute({
			answerId: answer.id.value,
			page: 2,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.answerComments.length).toEqual(2);
		expect(result.value?.answerComments[0].answerId).toEqual(answer.id);
		expect(result.value?.answerComments[1].answerId).toEqual(answer.id);
	});
});
