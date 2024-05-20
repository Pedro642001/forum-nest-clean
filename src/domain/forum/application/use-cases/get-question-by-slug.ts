import { Either, left, right } from "@/core/either/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Injectable } from "@nestjs/common";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetQuestionBySlugInput {
	slug: string;
}

type GetQuestionBySlugOutput = Either<
	ResourceNotFoundError,
	{ question: Question }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugInput): Promise<GetQuestionBySlugOutput> {
		const question = await this.questionsRepository.findBySlug(slug);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		return right({ question });
	}
}
