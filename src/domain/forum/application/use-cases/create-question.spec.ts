import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CreateQuestionUseCase } from "./create-question";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";

let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
	beforeEach(() => {
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);

		sut = new CreateQuestionUseCase(questionsRepositoryInMemory);
	});

	it("should be able to create a Question", async () => {
		const result = await sut.execute({
			authorId: "1",
			content: "content_test",
			title: "title_test",
			attachmentIds: ["1", "2"],
		});

		expect(result.isRight()).toEqual(true);
		expect(questionsRepositoryInMemory.items[0].content).toBe("content_test");
		expect(
			questionsRepositoryInMemory.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(
			questionsRepositoryInMemory.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
		]);
	});
});
