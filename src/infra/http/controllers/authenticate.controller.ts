import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { Public } from "@/infra/auth/decorators/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
	Body,
	Controller,
	InternalServerErrorException,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
export class AuthenticateController {
	constructor(private authenticateStudentUseCase: AuthenticateStudentUseCase) { }

	@Post()
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() { email, password }: AuthenticateBodySchema) {
		const result = await this.authenticateStudentUseCase.execute({
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case WrongCredentialsError:
					throw new UnauthorizedException(error.message);
				default:
					throw new InternalServerErrorException();
			}
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}
}