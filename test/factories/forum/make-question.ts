import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question, type QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { PrismaService } from '@/infra/databases/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionMapper } from '@/infra/databases/prisma/mappers/prisma-question-mapper';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  return Question.create({
    authorId: new UniqueEntityID(),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    ...override,
  }, id);
}


@Injectable()
export class QuestionFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestion(
		override: Partial<QuestionProps> = {},
	): Promise<Question> {
		const question = makeQuestion(override);

		const prismaQuestion = PrismaQuestionMapper.toPersistence(question);

		const questionCreated = await this.prisma.question.create({
			data: prismaQuestion,
		});

		return PrismaQuestionMapper.toDomain(questionCreated);
	}
}