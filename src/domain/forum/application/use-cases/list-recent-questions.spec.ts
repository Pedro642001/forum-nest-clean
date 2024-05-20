import { makeQuestion } from "test/factories/forum/make-question";
import { QuestionAttachmentsRepositoryInMemory } from "test/repositories/forum/question-attachments-repository-in-memory";
import { QuestionsRepositoryInMemory } from "test/repositories/forum/questions-repository-in-memory";
import { ListRecentQuestionsUseCase } from "./list-recent-questions";

let questionsRepositoryInMemory: QuestionsRepositoryInMemory;
let questionAttachmentsRepositoryInMemory: QuestionAttachmentsRepositoryInMemory;
let listRecentQuestionsUseCase: ListRecentQuestionsUseCase;

describe("List recent questions", () => {
	beforeEach(() => {
		questionAttachmentsRepositoryInMemory =
			new QuestionAttachmentsRepositoryInMemory();
		questionsRepositoryInMemory = new QuestionsRepositoryInMemory(
			questionAttachmentsRepositoryInMemory,
		);
		listRecentQuestionsUseCase = new ListRecentQuestionsUseCase(
			questionsRepositoryInMemory,
		);
	});

	it("Should be able to list recent questions", async () => {
		await questionsRepositoryInMemory.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 20),
			}),
		);

		await questionsRepositoryInMemory.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 18),
			}),
		);

		await questionsRepositoryInMemory.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 23),
			}),
		);

		const result = await listRecentQuestionsUseCase.execute({
			page: 1,
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.questions[0].createdAt.getDate()).toEqual(23);
			expect(result.value.questions[1].createdAt.getDate()).toEqual(20);
			expect(result.value.questions[2].createdAt.getDate()).toEqual(18);
		}
	});

	it("Should be able to list paginated recent questions", async () => {
		for (let i = 1; i <= 22; i++) {
			await questionsRepositoryInMemory.create(makeQuestion());
		}

		const result = await listRecentQuestionsUseCase.execute({
			page: 2,
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.questions.length).toEqual(2);
		}
	});
});
