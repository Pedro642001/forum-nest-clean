import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/databases/database.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/forum/make-answer";
import { QuestionFactory } from "test/factories/forum/make-question";
import { StudentFactory } from "test/factories/forum/make-student";

let app: INestApplication;
let prisma: PrismaService;
let jwtService: JwtService;
let studentFactory: StudentFactory;
let answerFactory: AnswerFactory;
let questionFactory: QuestionFactory;

describe("delete answer (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [AnswerFactory, QuestionFactory, StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		answerFactory = moduleRef.get(AnswerFactory);

		studentFactory = moduleRef.get(StudentFactory);

		questionFactory = moduleRef.get(QuestionFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[delete]: /answers/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.delete(`/answers/${answer.id.value}`)
			.set("Authorization", `Bearer ${jwt}`);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				id: answer.id.value,
			},
		});

		expect(response.statusCode).toBe(204);
		expect(answerOnDatabase).toBeNull();
	});
});
