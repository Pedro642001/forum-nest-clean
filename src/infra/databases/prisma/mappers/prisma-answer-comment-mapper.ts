import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client";

export class PrismaAnswerCommentMapper {
	static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId){
      throw new Error('Invalid comment type.')
    }

		return AnswerComment.create(
			{
				content: raw.content,
				answerId: new UniqueEntityID(raw.answerId),
				authorId: new UniqueEntityID(raw.authorId),
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(answerComment: AnswerComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: answerComment.id.value,
			authorId: answerComment.authorId.value,
			content: answerComment.content,
      answerId: answerComment.answerId.value,
			createdAt: answerComment.createdAt,
			updatedAt: answerComment.updatedAt,
		};
	}
}
