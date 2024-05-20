import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/databases/database.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/forum/make-student";

let app: INestApplication;
let prisma: PrismaService;
let studentFactory: StudentFactory;


describe("Authenticate (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule,AppModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		studentFactory = moduleRef.get(StudentFactory)

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test("[POST]: /sessions", async () => {
		await  studentFactory.makePrismaStudent({
			email: "joedoe@gmail.com",
			password: await hash("12345", 8),
		})
		
		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "joedoe@gmail.com",
			password: "12345",
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			access_token: expect.any(String),
		});
	});
});
