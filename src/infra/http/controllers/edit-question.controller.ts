import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/strategies/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	NotFoundException,
	Param,
	Put,
	UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller("/questions/:questionId")
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("questionId")
		questionId: string,
		@Body(bodyValidationPipe)
		{ title, content }: EditQuestionBodySchema,
	) {
		const userId = user.sub;

		const result = await this.editQuestion.execute({
			questionId,
			authorId: userId,
			title,
			content,
			attachmentIds: [],
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				case NotAllowedError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException();
			}
		}

		const question = result.value;

		return { question };
	}
}
