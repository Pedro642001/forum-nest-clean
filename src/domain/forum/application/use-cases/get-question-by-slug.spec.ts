import { makeQuestion } from "test/factories/forum/make-question";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { Slug } from "../../enterprise/object-values/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let sut: GetQuestionBySlugUseCase;

describe("Get question by slug", () => {
	beforeEach(() => {
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);
		sut = new GetQuestionBySlugUseCase(questionsRepositoryInMemory);
	});

	it("Should be able to get question by slug", async () => {
		const slug = Slug.createFromText("new question");

		const newQuestion = makeQuestion({
			slug,
		});

		await questionsRepositoryInMemory.create(newQuestion);

		const result = await sut.execute({
			slug: slug.value,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
			}),
		});
	});
});
