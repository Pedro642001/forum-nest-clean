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
let commentFactory: QuestionCommentFactory;
let questionFactory: QuestionFactory;

describe("delete question comment (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [QuestionCommentFactory, QuestionFactory, StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		commentFactory = moduleRef.get(QuestionCommentFactory);

		studentFactory = moduleRef.get(StudentFactory);

		questionFactory = moduleRef.get(QuestionFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[delete]: /questions/comments/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const comment = await commentFactory.makePrismaQuestionComment({
			authorId: user.id,
			questionId: question.id,
		});

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${comment.id.value}`)
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
