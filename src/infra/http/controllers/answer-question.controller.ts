import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/strategies/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const answerQuestionBodySchema = z.object({
	content: z.string(),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("questionId")
		questionId: string,
		@Body(bodyValidationPipe)
		{ content }: AnswerQuestionBodySchema,
	) {
		const userId = user.sub;

		await this.answerQuestion.execute({
			instructorId: userId,
			questionId: questionId,
			attachmentIds: [],
			content,
		});
	}
}
