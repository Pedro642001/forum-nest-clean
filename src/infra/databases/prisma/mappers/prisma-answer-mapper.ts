import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Prisma, Answer as PrismaAnswer } from "@prisma/client";

export class PrismaAnswerMapper {
	static toDomain(raw: PrismaAnswer): Answer {
		return Answer.create(
			{
				content: raw.content,
				authorId: new UniqueEntityID(raw.authorId),
				questionId: new UniqueEntityID(raw.questionId),
				createdAt: raw.createdAt,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(answer: Answer): Prisma.AnswerUncheckedCreateInput {
		return {
			id: answer.id.value,
			authorId: answer.authorId.value,
			questionId: answer.questionId.value,
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}
