import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/forum/make-question";
import { makeQuestionAttachment } from "test/factories/forum/make-question-attachment";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "./errors/not-allowed-error";

let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let questionsAttachmentRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let sut: EditQuestionUseCase;

describe("Edit question", () => {
	beforeEach(() => {
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();

		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);

		questionsAttachmentRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();

		sut = new EditQuestionUseCase(
			questionsAttachmentRepositoryInMemory,
			questionsRepositoryInMemory,
		);
	});

	it("Should be able to edit a question", async () => {
		const question = makeQuestion();

		await questionsRepositoryInMemory.create(question);

		await questionsAttachmentRepositoryInMemory.create(
			makeQuestionAttachment({
				questionId: question.id,
				attachmentId: new UniqueEntityID("1"),
			}),
		);

		await questionsAttachmentRepositoryInMemory.create(
			makeQuestionAttachment({
				questionId: question.id,
				attachmentId: new UniqueEntityID("2"),
			}),
		);

		await questionsAttachmentRepositoryInMemory.create(
			makeQuestionAttachment({
				questionId: question.id,
				attachmentId: new UniqueEntityID("3"),
			}),
		);

		await sut.execute({
			authorId: question.authorId.value,
			questionId: question.id.value,
			content: "new content",
			title: "new title",
			attachmentIds: ["1", "3"],
		});

		expect(questionsRepositoryInMemory.items[0]).toMatchObject({
			title: "new title",
			content: "new content",
		});

		expect(questionsRepositoryInMemory.items[0]).toMatchObject({
			title: "new title",
			content: "new content",
		});

		expect(
			questionsRepositoryInMemory.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
		]);
	});

	it("Should not be able to edit an question from another user", async () => {
		const questionId = new UniqueEntityID();
		const userId = new UniqueEntityID();
		const anotherUserId = new UniqueEntityID();

		const question = makeQuestion({ authorId: anotherUserId }, questionId);

		await questionsRepositoryInMemory.create(question);

		const result = await sut.execute({
			questionId: questionId.value,
			authorId: userId.value,
			content: "new content",
			title: "new title",
			attachmentIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(NotAllowedError);
	});
});
