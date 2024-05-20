import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/databases/database.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerCommentFactory } from "test/factories/forum/make-answer-comment";
import { AnswerFactory } from "test/factories/forum/make-answer";
import { StudentFactory } from "test/factories/forum/make-student";
import { QuestionFactory } from "test/factories/forum/make-question";

let app: INestApplication;
let prisma: PrismaService;
let jwtService: JwtService;
let studentFactory: StudentFactory;
let answerFactory: AnswerFactory;
let questionFactory: QuestionFactory;
let commentFactory: AnswerCommentFactory;

describe("List answer comments (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [StudentFactory,QuestionFactory,AnswerCommentFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);

		answerFactory = moduleRef.get(AnswerFactory);

		questionFactory = moduleRef.get(QuestionFactory);

    commentFactory = moduleRef.get(AnswerCommentFactory)

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[GET]: /answers/:answerId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id
		});

    const comment1 = await commentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: user.id
    })

    const comment2 = await commentFactory.makePrismaAnswerComment({
      answerId: answer.id,
      authorId: user.id
    })

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.get(`/answers/${answer.id.value}/comments`)
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
