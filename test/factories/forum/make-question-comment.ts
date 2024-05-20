import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionComment, QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/databases/prisma/prisma.service';
import { PrismaQuestionCommentMapper } from '@/infra/databases/prisma/mappers/prisma-question-comment-mapper';

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionComment.create({
    authorId: new UniqueEntityID(),
    questionId: new UniqueEntityID(),
    content: faker.lorem.paragraphs(),
    ...override,
  }, id);
}


@Injectable()
export class QuestionCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionComment(
		override: Partial<QuestionCommentProps> = {},
	): Promise<QuestionComment> {
		const questionComment = makeQuestionComment(override);

		const prismaQuestionComment = PrismaQuestionCommentMapper.toPersistence(questionComment);

		const questionCommentCreated = await this.prisma.comment.create({
			data: prismaQuestionComment,
		});

		return PrismaQuestionCommentMapper.toDomain(questionCommentCreated);
	}
}