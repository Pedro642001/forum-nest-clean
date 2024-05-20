import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async create(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

		await this.prisma.comment.create({ data });
	}
	async delete(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

		await this.prisma.comment.delete({ where: { id: data.id } });
	}

	async update(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

		await this.prisma.comment.update({ data, where: { id: data.id } });
	}

	async findById(answerCommentId: string): Promise<AnswerComment | null> {
		const answerComment = await this.prisma.comment.findFirst({
			where: {
				id: answerCommentId,
			},
		});

		if (!answerComment) {
			return null;
		}

		return PrismaAnswerCommentMapper.toDomain(answerComment);
	}
	
	async findManyByAnswerId(
		answerId: string,
		{page}: PaginationParams,
	): Promise<AnswerComment[]> {
		const answerComments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return answerComments.map(PrismaAnswerCommentMapper.toDomain);
	}
}
