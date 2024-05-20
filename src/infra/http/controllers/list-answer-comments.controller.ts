import { ListAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/list-answer-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query
} from "@nestjs/common";
import { z } from "zod";
import { AnswerCommentPresenter } from "../presenters/answer-comment-presenter";

const pageQueryParamSchema = z
	.string()
	.optional()
	.default("1")
	.transform(Number)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/answers/:answerId/comments")
export class ListAnswerCommentsController {
	constructor(private listAnswerComments: ListAnswerCommentsUseCase) {}

	@Get()
	async handle(
		@Param("answerId")
		answerId: string,
		@Query("page", queryValidationPipe)
		page: PageQueryParamSchema,
	) {
		const result = await this.listAnswerComments.execute({
			answerId,
			page,
		});

		if (result.isLeft()) {
        throw new BadRequestException();
		}

		const { answerComments } = result.value;

		return { comments: answerComments.map(AnswerCommentPresenter.toHTTP) };
	}
}
