import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { ListQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/list-question-answers";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Param,
	Query,
} from "@nestjs/common";
import { z } from "zod";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/:questionId/answers")
export class ListQuestionAnswersController {
	constructor(private listQuestionAnswers: ListQuestionAnswersUseCase) {}

	@Get()
	async handle(
		@Param("questionId")
		questionId: string,
		@Query("page", queryValidationPipe)
		page: PageQueryParamSchema,
	) {
		const result = await this.listQuestionAnswers.execute({
			questionId,
			page,
		});

		if (result.isLeft()) {
			const error = result.value;
			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException();
			}
		}

		const { answers } = result.value;

		return { answers: answers.map(AnswerPresenter.toHTTP) };
	}
}
