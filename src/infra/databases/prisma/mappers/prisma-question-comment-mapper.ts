import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client";

export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId){
      throw new Error('Invalid comment type.')
    }

		return QuestionComment.create(
			{
				content: raw.content,
				questionId: new UniqueEntityID(raw.questionId),
				authorId: new UniqueEntityID(raw.authorId),
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: questionComment.id.value,
			authorId: questionComment.authorId.value,
			content: questionComment.content,
      questionId: questionComment.questionId.value,
			createdAt: questionComment.createdAt,
			updatedAt: questionComment.updatedAt,
		};
	}
}
