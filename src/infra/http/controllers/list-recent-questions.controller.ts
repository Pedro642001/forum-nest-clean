import { ListRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/list-recent-questions";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
	BadRequestException,
	Controller,
	Get,
	Query
} from "@nestjs/common";
import { z } from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions")
export class ListRecentQuestionsController {
	constructor(private listRecentQuestions: ListRecentQuestionsUseCase) {}

	@Get()
	async handle(
		@Query("page", queryValidationPipe)
		page: PageQueryParamSchema,
	) {
		const result = await this.listRecentQuestions.execute({
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { questions } = result.value;

		return { questions: questions.map(QuestionPresenter.toHTTP) };
	}
}
