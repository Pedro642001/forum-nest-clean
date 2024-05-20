import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/forum/make-question";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { DeleteQuestionUseCase } from "./delete-question";
import { NotAllowedError } from "./errors/not-allowed-error";

let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let sut: DeleteQuestionUseCase;

describe("Delete question", () => {
	beforeEach(() => {
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);

		sut = new DeleteQuestionUseCase(questionsRepositoryInMemory);
	});
	it("Should be able to delete an question", async () => {
		const questionId = new UniqueEntityID();
		const authorId = new UniqueEntityID();

		const question = makeQuestion({ authorId }, questionId);

		await questionsRepositoryInMemory.create(question);

		await sut.execute({
			questionId: questionId.value,
			authorId: authorId.value,
		});

		expect(questionsRepositoryInMemory.items).toHaveLength(0);
	});

	it("Should not be able to delete an question from another user", async () => {
		const questionId = new UniqueEntityID();
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const question = makeQuestion({ authorId: anotherUserId }, questionId);

		await questionsRepositoryInMemory.create(question);

		const result = await sut.execute({
			questionId: questionId.value,
			authorId: userId.value,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(NotAllowedError);
	});
});
