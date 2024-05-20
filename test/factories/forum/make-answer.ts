import { faker } from '@faker-js/faker';
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, type AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/databases/prisma/prisma.service';
import { PrismaAnswerMapper } from '@/infra/databases/prisma/mappers/prisma-answer-mapper';

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  return Answer.create({
    authorId: new UniqueEntityID(),
    questionId: new UniqueEntityID(),
    content: faker.lorem.paragraphs(),
    ...override,
  }, id);
}


@Injectable()
export class AnswerFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswer(
		override: Partial<AnswerProps> = {},
	): Promise<Answer> {
		const answer = makeAnswer(override);

		const prismaAnswer = PrismaAnswerMapper.toPersistence(answer);

		const answerCreated = await this.prisma.answer.create({
			data: prismaAnswer,
		});

		return PrismaAnswerMapper.toDomain(answerCreated);
	}
}

