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
let questionFactory: QuestionFactory;
let answerFactory: AnswerFactory;

describe("List question answers (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [StudentFactory,AnswerFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);

		questionFactory = moduleRef.get(QuestionFactory);

    answerFactory = moduleRef.get(AnswerFactory)

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[GET]: /questions/:questionId/answers", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: "Question 01",
		});

    const answer1 = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id
    })

    const answer2 = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id
    })

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.value}/answers`)
			.set("Authorization", `Bearer ${jwt}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toMatchObject({
			answers: expect.arrayContaining([
				expect.objectContaining({ id: answer1.id.value }),
				expect.objectContaining({ id: answer2.id.value }),
			]),
		});
	});
});
