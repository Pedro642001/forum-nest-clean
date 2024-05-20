import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/object-values/slug";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
	static toDomain(raw: PrismaQuestion): Question {
		return Question.create(
			{
				authorId: new UniqueEntityID(raw.authorId),
				content: raw.content,
				title: raw.title,
				bestAnswerId: raw.bestAnswerId
					? new UniqueEntityID(raw.bestAnswerId)
					: null,
				slug: Slug.create(raw.slug),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityID(raw.id),
		);
	}

	static toPersistence(
		question: Question,
	): Prisma.QuestionUncheckedCreateInput {
		return {
			id: question.id.value,
			authorId: question.authorId.value,
			content: question.content,
			bestAnswerId: question.bestAnswerId?.value,
			title: question.title,
			slug: question.slug.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}
