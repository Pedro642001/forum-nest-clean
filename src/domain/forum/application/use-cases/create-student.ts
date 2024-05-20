import { Either, left, right } from "@/core/either/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { StudentAlreadyExists } from "./errors/student-already-exists-error";
import { HashGenerator } from "../gateways/hash-generator";

interface CreateStudentInput {
	name: string;
	email: string;
	password: string;
}

type CreateStudentOutput = Either<StudentAlreadyExists, { student: Student }>;

@Injectable()
export class CreateStudentUseCase {
	constructor(
		private studentsRepository: StudentsRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		email,
		password,
	}: CreateStudentInput): Promise<CreateStudentOutput> {
		const studentWithSameEmail =
			await this.studentsRepository.findByEmail(email);

		if (studentWithSameEmail) {
			return left(new StudentAlreadyExists());
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const student = Student.create({
			email,
			name,
			password: hashedPassword,
		});

		await this.studentsRepository.create(student);

		return right({
			student,
		});
	}
}
