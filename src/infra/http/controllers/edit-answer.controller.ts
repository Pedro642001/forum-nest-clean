import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
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

const editAnswerBodySchema = z.object({
	content: z.string(),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

@Controller("/answers/:id")
export class EditAnswerController {
	constructor(private editAnswer: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("id")
		answerId: string,
		@Body(bodyValidationPipe)
		{ content }: EditAnswerBodySchema,
	) {
		const userId = user.sub;

		const result = await this.editAnswer.execute({
			answerId,
			authorId: userId,
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

		const answer = result.value;

		return { answer };
	}
}
