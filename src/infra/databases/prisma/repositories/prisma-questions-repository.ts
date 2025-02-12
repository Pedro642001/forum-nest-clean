import { Injectable } from "@nestjs/common";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private prisma: PrismaService) {}

	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.create({ data });
	}

	async update(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.update({ data, where: { id: data.id } });
	}

	async delete(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.delete({ where: { id: data.id } });
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = await this.prisma.question.findFirst({
			where: {
				slug,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async findById(questionId: string): Promise<Question | null> {
		const question = await this.prisma.question.findFirst({
			where: {
				id: questionId,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return questions.map((question) => PrismaQuestionMapper.toDomain(question));
	}
}
