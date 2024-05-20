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

describe("edit question (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [QuestionFactory, StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		questionFactory = moduleRef.get(QuestionFactory);

		studentFactory = moduleRef.get(StudentFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[PUT]: /question", async () => {
		const user = await studentFactory.makePrismaStudent();

		const jwt = jwtService.sign({ sub: user.id.value });

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id.value}`)
			.set("Authorization", `Bearer ${jwt}`)
			.send({
				title: "new title",
				content: "new content",
				authorId: user.id.value,
			});

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "new title",
			},
		});

		expect(response.statusCode).toBe(204);
		expect(questionOnDatabase).toMatchObject({
			title: "new title",
			content: "new content",
		});
	});
});
