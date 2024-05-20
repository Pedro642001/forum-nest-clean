import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerQuestionUseCase } from "./answer-question";
import { AnswersRepositoryInMemory } from "test/repositories/forum/answers-repository-in-memory";
import { AnswerAttachmentsRepositoryInMemory } from "test/repositories/forum/answer-attachments-repository-in-memory";

let answersRepositoryInMemory: AnswersRepositoryInMemory;
let answerAttachmentsRepositoryInMemory: AnswerAttachmentsRepositoryInMemory;
let answerQuestionUseCase: AnswerQuestionUseCase;

describe("Answer question", () => {
	beforeEach(() => {
		answerAttachmentsRepositoryInMemory =
			new AnswerAttachmentsRepositoryInMemory();
		answersRepositoryInMemory = new AnswersRepositoryInMemory(
			answerAttachmentsRepositoryInMemory,
		);
		answerQuestionUseCase = new AnswerQuestionUseCase(
			answersRepositoryInMemory,
		);
	});

	it("Should be able to create an answer", async () => {
		const result = await answerQuestionUseCase.execute({
			content: "new answer",
			instructorId: "1",
			questionId: "1",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight()).toBe(true);
		expect(answersRepositoryInMemory.items[0]).toBe(result.value?.answer);
		expect(
			answersRepositoryInMemory.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(answersRepositoryInMemory.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
				expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
			],
		);
	});
});
