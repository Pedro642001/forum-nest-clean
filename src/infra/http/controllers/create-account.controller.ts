import { CreateStudentUseCase } from "@/domain/forum/application/use-cases/create-student";
import { StudentAlreadyExists } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
import { Public } from "@/infra/auth/decorators/public";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	InternalServerErrorException,
	Post,
	UsePipes,
} from "@nestjs/common";
import { z } from "zod";

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@Public()
export class CreateAccountController {
	constructor(private createStudent: CreateStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
		const { name, email, password } = createAccountBodySchema.parse(body);

		const result = await this.createStudent.execute({
			name,
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case StudentAlreadyExists:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException();
			}
		}
	}
}
