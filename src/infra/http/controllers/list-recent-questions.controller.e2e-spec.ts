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

describe("List recent questions (E2E)", () => {
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

	test("[GET]: /questions", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question1 = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: "Question 01",
		});

		const question2 = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: "Question 02",
		});

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.get("/questions")
			.set("Authorization", `Bearer ${jwt}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toMatchObject({
			questions: expect.arrayContaining([
				expect.objectContaining({ title: question2.title }),
				expect.objectContaining({ title: question1.title }),
			]),
		});
	});
});
