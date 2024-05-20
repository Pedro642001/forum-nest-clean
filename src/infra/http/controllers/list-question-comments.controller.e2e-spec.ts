import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/databases/database.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionCommentFactory } from "test/factories/forum/make-question-comment";
import { QuestionFactory } from "test/factories/forum/make-question";
import { StudentFactory } from "test/factories/forum/make-student";

let app: INestApplication;
let prisma: PrismaService;
let jwtService: JwtService;
let studentFactory: StudentFactory;
let questionFactory: QuestionFactory;
let commentFactory: QuestionCommentFactory;

describe("List question comments (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [StudentFactory,QuestionCommentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);

		questionFactory = moduleRef.get(QuestionFactory);

    commentFactory = moduleRef.get(QuestionCommentFactory)

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[GET]: /questions/:questionId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: "Question 01",
		});

    const comment1 = await commentFactory.makePrismaQuestionComment({
      questionId: question.id,
      authorId: user.id
    })

    const comment2 = await commentFactory.makePrismaQuestionComment({
      questionId: question.id,
      authorId: user.id
    })

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.value}/comments`)
			.set("Authorization", `Bearer ${jwt}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toMatchObject({
			comments: expect.arrayContaining([
				expect.objectContaining({ id: comment1.id.value }),
				expect.objectContaining({ id: comment2.id.value }),
			]),
		});
	});
});
