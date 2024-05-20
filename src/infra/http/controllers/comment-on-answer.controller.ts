import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/strategies/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("answerId")
		answerId: string,
		@Body(bodyValidationPipe)
		{ content }: CommentOnAnswerBodySchema,
	) {
		const userId = user.sub;

		await this.commentOnAnswer.execute({
			authorId: userId,
			answerId: answerId,
			content,
		});
	}
}
