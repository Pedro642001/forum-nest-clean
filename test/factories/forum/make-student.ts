import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	Student,
	type StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { PrismaStudentMapper } from "@/infra/databases/prisma/mappers/prisma-student-mapper";
import { Injectable } from "@nestjs/common";

export function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueEntityID,
) {
	return Student.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	);
}

@Injectable()
export class StudentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaStudent(
		override: Partial<StudentProps> = {},
	): Promise<Student> {
		const student = makeStudent(override);

		const prismaStudent = PrismaStudentMapper.toPersistence(student);

		const studentCreated = await this.prisma.user.create({
			data: prismaStudent,
		});

		return PrismaStudentMapper.toDomain(studentCreated);
	}
}
