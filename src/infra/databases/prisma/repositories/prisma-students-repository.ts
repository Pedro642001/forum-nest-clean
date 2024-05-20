import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaService } from "../prisma.service";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
	constructor(private prisma: PrismaService) {}

	async create(student: Student): Promise<void> {
		const prismaStudent = PrismaStudentMapper.toPersistence(student);

		await this.prisma.user.create({
			data: prismaStudent,
		});
	}

	async findByEmail(email: string): Promise<Student | null> {
		const student = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!student) {
			return null;
		}

		return PrismaStudentMapper.toDomain(student);
	}
}
