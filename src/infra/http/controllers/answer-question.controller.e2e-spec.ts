import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/databases/database.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/forum/make-question";
import { StudentFactory } from "test/factories/forum/make-student";

let app: INestApplication;
let prisma: PrismaService;
let jwtService: JwtService;
let studentFactory: StudentFactory;
let questionFactory: QuestionFactory;

describe("answer question (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /question/:questionId/answers", async () => {
		const student = await studentFactory.makePrismaStudent();
		const instructor = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: student.id,
		});

		const jwt = jwtService.sign({ sub: instructor.id.value });

		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id.value}/answers`)
			.set("Authorization", `Bearer ${jwt}`)
			.send({
				content: "new content",
			});

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				authorId: instructor.id.value,
			},
		});

		expect(response.statusCode).toBe(201);
		expect(answerOnDatabase).toMatchObject({
			content: "new content",
			authorId: instructor.id.value,
		});
	});
});
