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

describe("comment on answer (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /answer/:answerId/comments", async () => {
		const student = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: student.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: student.id,
			questionId: question.id,
		});

		const jwt = jwtService.sign({ sub: student.id.value });

		const response = await request(app.getHttpServer())
			.post(`/answers/${answer.id.value}/comments`)
			.set("Authorization", `Bearer ${jwt}`)
			.send({
				content: "new content",
			});

		const commentOnDatabase = await prisma.comment.findFirst({
			where: {
				authorId: student.id.value,
			},
		});

		expect(response.statusCode).toBe(201);
		expect(commentOnDatabase).toMatchObject({
			content: "new content",
			authorId: student.id.value,
		});
	});
});
