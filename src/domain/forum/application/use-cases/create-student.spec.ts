import { StudentsRepositoryInMemory } from "test/repositories/forum/students-repository-in-memory";
import { CreateStudentUseCase } from "./create-student";
import { FakeHasher } from "test/gateways/fake-hasher";
import { Student } from "../../enterprise/entities/student";
import { StudentAlreadyExists } from "./errors/student-already-exists-error";

let hasherGateway: FakeHasher;
let studentsRepositoryInMemory: StudentsRepositoryInMemory;
let sut: CreateStudentUseCase;

describe("Create student", () => {
	beforeEach(() => {
		hasherGateway = new FakeHasher();
		studentsRepositoryInMemory = new StudentsRepositoryInMemory();

		sut = new CreateStudentUseCase(studentsRepositoryInMemory, hasherGateway);
	});

	it("Should be able to create a new student", async () => {
		const result = await sut.execute({
			name: "Xuxa da Silva",
			email: "xuxa@gmail.com",
			password: "Test123!@#",
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.student).toMatchObject({
				name: "Xuxa da Silva",
				email: "xuxa@gmail.com",
			});
		}
	});

	it("Should be able to create a hashed password for student", async () => {
		const result = await sut.execute({
			name: "Xuxa da Silva",
			email: "xuxa@gmail.com",
			password: "Test123!@#",
		});

		expect(result.isRight()).toBe(true);
		expect(studentsRepositoryInMemory.items[0].password).toBe(
			"Test123!@#-hashed",
		);
	});

	it("Should not be able to create an student with same another student email", async () => {
		const student = Student.create({
			name: "Xuxa da Silva 1",
			email: "xuxa@gmail.com",
			password: "Test123!@#",
		});

		await studentsRepositoryInMemory.create(student);

		const result = await sut.execute({
			name: "Xuxa da Silva",
			email: "xuxa@gmail.com",
			password: "Test123!@#",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(StudentAlreadyExists);
	});
});
