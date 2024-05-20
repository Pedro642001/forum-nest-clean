import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

let app: INestApplication;
let prisma: PrismaService;

describe("Create account (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	test("[POST]: /accounts", async () => {
		const response = await request(app.getHttpServer()).post("/accounts").send({
			name: "Joe Doe",
			email: "joedoe@gmail.com",
			password: "12345",
		});

		const userOnDatabase = await prisma.user.findUnique({
			where: {
				email: "joedoe@gmail.com",
			},
		});

		expect(response.statusCode).toBe(201);
		expect(userOnDatabase).toMatchObject({
			name: "Joe Doe",
			email: "joedoe@gmail.com",
		});
	});
});
