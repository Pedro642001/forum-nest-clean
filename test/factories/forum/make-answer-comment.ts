import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/databases/prisma/prisma.service';
import { PrismaAnswerCommentMapper } from '@/infra/databases/prisma/mappers/prisma-answer-comment-mapper';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerComment.create({
    authorId: new UniqueEntityID(),
    answerId: new UniqueEntityID(),
    content: faker.lorem.paragraphs(),
    ...override,
  }, id);
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswerComment(
		override: Partial<AnswerCommentProps> = {},
	): Promise<AnswerComment> {
		const answerComment = makeAnswerComment(override);

		const prismaAnswerComment = PrismaAnswerCommentMapper.toPersistence(answerComment);

		const answerCommentCreated = await this.prisma.comment.create({
			data: prismaAnswerComment,
		});

		return PrismaAnswerCommentMapper.toDomain(answerCommentCreated);
	}
}