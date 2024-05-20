import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { Prisma, User as PrismaStudent } from "@prisma/client";

export class PrismaStudentMapper {
	static toDomain(raw: PrismaStudent): Student {
		return Student.create(
			{
				email: raw.email,
				name: raw.name,
				password: raw.password,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: student.id.value,
			email: student.email,
			name: student.name,
			password: student.password,
		};
	}
}
