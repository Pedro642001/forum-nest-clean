import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
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

@Controller("/answers/:id")
export class DeleteAnswerController {
	constructor(private deleteAnswer: DeleteAnswerUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser()
		user: UserPayload,
		@Param("id")
		answerId: string,
	) {
		const userId = user.sub;

		const result = await this.deleteAnswer.execute({
			answerId,
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
