import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import type { Student } from "@/domain/forum/enterprise/entities/student";

export class StudentsRepositoryInMemory implements StudentsRepository {
	public items: Array<Student> = [];

	async create(student: Student): Promise<void> {
		this.items.push(student);
	}

	async findByEmail(email: string): Promise<Student | null> {
		const student = this.items.find((item) => item.email === email);

		if (!student) {
			return null;
		}

		return student;
	}
}
