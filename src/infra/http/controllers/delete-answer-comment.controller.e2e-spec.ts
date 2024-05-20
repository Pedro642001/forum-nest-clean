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
let questionFactory: QuestionFactory;
let commentFactory: AnswerCommentFactory;
let answerFactory: AnswerFactory;

describe("delete answer comment (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [
				AnswerCommentFactory,
				QuestionFactory,
				AnswerFactory,
				StudentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		questionFactory = moduleRef.get(QuestionFactory);

		commentFactory = moduleRef.get(AnswerCommentFactory);

		studentFactory = moduleRef.get(StudentFactory);

		answerFactory = moduleRef.get(AnswerFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[delete]: /answers/comments/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		});

		const comment = await commentFactory.makePrismaAnswerComment({
			authorId: user.id,
			answerId: answer.id,
		});

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/${comment.id.value}`)
			.set("Authorization", `Bearer ${jwt}`);

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: comment.id.value,
			},
		});

		expect(response.statusCode).toBe(204);
		expect(commentOnDatabase).toBeNull();
	});
});
