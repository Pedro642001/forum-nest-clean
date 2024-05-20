import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/strategies/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Body(bodyValidationPipe)
		{ title, content }: CreateQuestionBodySchema,
	) {
		const userId = user.sub;

		await this.createQuestion.execute({
			authorId: userId,
			title,
			content,
			attachmentIds: [],
		});
	}
}
