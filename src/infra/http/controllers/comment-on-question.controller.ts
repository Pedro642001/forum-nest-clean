import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/strategies/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const commentOnQuestionBodySchema = z.object({
	content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
	constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("questionId")
		questionId: string,
		@Body(bodyValidationPipe)
		{ content }: CommentOnQuestionBodySchema,
	) {
		const userId = user.sub;

		await this.commentOnQuestion.execute({
			authorId: userId,
			questionId: questionId,
			content,
		});
	}
}
