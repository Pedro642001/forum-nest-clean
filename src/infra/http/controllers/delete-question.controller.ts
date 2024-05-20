import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/decorators/current-user.decorator";
import { UserPayload } from "@/infra/auth/strategies/jwt.strategy";
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	NotFoundException,
	Param,
	UnauthorizedException,
} from "@nestjs/common";

@Controller("/questions/:id")
export class DeleteQuestionController {
	constructor(private deleteQuestion: DeleteQuestionUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("id")
		questionId: string,
	) {
		const userId = user.sub;

		const result = await this.deleteQuestion.execute({
			questionId,
			authorId: userId,
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
	}
}
