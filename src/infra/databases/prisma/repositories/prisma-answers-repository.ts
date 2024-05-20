import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(private prisma: PrismaService) {}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPersistence(answer);

		await this.prisma.answer.create({ data });
	}

	async update(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPersistence(answer);

		await this.prisma.answer.update({ data, where: { id: data.id } });
	}

	async delete(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPersistence(answer);

		await this.prisma.answer.delete({ where: { id: data.id } });
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findFirst({
			where: {
				id,
			},
		});

		if (!answer) {
			return null;
		}

		return PrismaAnswerMapper.toDomain(answer);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return answers.map(PrismaAnswerMapper.toDomain);
	}
}
