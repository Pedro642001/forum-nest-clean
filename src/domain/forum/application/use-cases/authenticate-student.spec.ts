import { makeStudent } from "test/factories/forum/make-student";
import { FakeEncrypter } from "test/gateways/fake-encypter";
import { FakeHasher } from "test/gateways/fake-hasher";
import { StudentsRepositoryInMemory } from "test/repositories/forum/students-repository-in-memory";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let hasherGateway: FakeHasher;
let encrypterGateway: FakeEncrypter;
let studentsRepositoryInMemory: StudentsRepositoryInMemory;
let sut: AuthenticateStudentUseCase;

describe("Authenticate student", () => {
	beforeEach(() => {
		hasherGateway = new FakeHasher();
		encrypterGateway = new FakeEncrypter();
		studentsRepositoryInMemory = new StudentsRepositoryInMemory();

		sut = new AuthenticateStudentUseCase(
			studentsRepositoryInMemory,
			hasherGateway,
			encrypterGateway,
		);
	});

	it("Should be able to authenticate a student", async () => {
		const student = makeStudent({
			password: "password-hashed",
		});

		await studentsRepositoryInMemory.create(student);

		const result = await sut.execute({
			email: student.email,
			password: "password",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: JSON.stringify({ sub: student.id.value }),
		});
	});

	it("Should not be able to authenticate a student with incorrect password", async () => {
		const student = makeStudent({
			password: "password-hashed",
		});

		await studentsRepositoryInMemory.create(student);

		const result = await sut.execute({
			email: student.email,
			password: "incorrect-password",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(WrongCredentialsError);
	});

	it("Should not be able to authenticate a student with non-existent email", async () => {
		const student = makeStudent({
			password: "password-hashed",
		});

		const result = await sut.execute({
			email: student.email,
			password: "password",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(WrongCredentialsError);
	});
});
