import { Either, left, right } from "@/core/either/either";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../gateways/encrypter";
import { StudentsRepository } from "../repositories/students-repository";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { HashComparer } from "../gateways/hash-comparer";

interface AuthenticateStudentInput {
	email: string;
	password: string;
}

type AuthenticateStudentOutput = Either<
	WrongCredentialsError,
	{ accessToken: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private studentsRepository: StudentsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentInput): Promise<AuthenticateStudentOutput> {
		const student = await this.studentsRepository.findByEmail(email);

		if (!student) {
			return left(new WrongCredentialsError());
		}

		const passwordIsValid = await this.hashComparer.compare(
			password,
			student.password,
		);

		if (!passwordIsValid) {
			return left(new WrongCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({ sub: student.id.value });

		return right({
			accessToken,
		});
	}
}
