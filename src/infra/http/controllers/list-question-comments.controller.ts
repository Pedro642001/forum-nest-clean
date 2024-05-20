import { ListQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/list-question-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query
} from "@nestjs/common";
import { z } from "zod";
import { QuestionCommentPresenter } from "../presenters/question-comment-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/:questionId/comments")
export class ListQuestionCommentsController {
	constructor(private listQuestionComments: ListQuestionCommentsUseCase) {}

	@Get()
	async handle(
		@Param("questionId")
		questionId: string,
		@Query("page", queryValidationPipe)
		page: PageQueryParamSchema,
	) {
		const result = await this.listQuestionComments.execute({
			questionId,
			page,
		});

		if (result.isLeft()) {
        throw new BadRequestException();
		}

		const { questionComments } = result.value;

		return { comments: questionComments.map(QuestionCommentPresenter.toHTTP) };
	}
}
