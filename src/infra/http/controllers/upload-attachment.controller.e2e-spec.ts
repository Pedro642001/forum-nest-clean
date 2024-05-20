import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/databases/database.module";
import { PrismaService } from "@/infra/databases/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/forum/make-student";

let app: INestApplication;
let prisma: PrismaService;
let jwtService: JwtService;
let studentFactory: StudentFactory;

describe("upload attachment (E2E)", () => {
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [DatabaseModule, AppModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);

		jwtService = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /attachment", async () => {
		const user = await studentFactory.makePrismaStudent();

		const jwt = jwtService.sign({ sub: user.id.value });

		const response = await request(app.getHttpServer())
			.post("/attachments")
			.set("Authorization", `Bearer ${jwt}`)
			.attach("file", "./test/e2e/upload-image-test.png");

		expect(response.status).toBe(201);
	});
});
