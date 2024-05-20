import { Either, left, right } from "@/core/either/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

type ListQuestionAnswersInput = {
	questionId: string;
	page: number;
};

type ListQuestionAnswersOutput = Either<
	ResourceNotFoundError,
	{ answers: Answer[] }
>;

@Injectable()
export class ListQuestionAnswersUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({
		questionId,
		page,
	}: ListQuestionAnswersInput): Promise<ListQuestionAnswersOutput> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		const answers = await this.answersRepository.findManyByQuestionId(
			question.id.value,
			{ page },
		);

		return right({
			answers,
		});
	}
}
