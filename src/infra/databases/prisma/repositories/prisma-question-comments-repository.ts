import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.create({ data });
	}
	async delete(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.delete({ where: { id: data.id } });
	}

	async update(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.update({ data, where: { id: data.id } });
	}

	async findById(questionCommentId: string): Promise<QuestionComment | null> {
		const questionComment = await this.prisma.comment.findFirst({
			where: {
				id: questionCommentId,
			},
		});

		if (!questionComment) {
			return null;
		}

		return PrismaQuestionCommentMapper.toDomain(questionComment);
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			take: 20,
			skip: (page - 1) * 20,
		});

		return questionComments.map(PrismaQuestionCommentMapper.toDomain);
	}
}
