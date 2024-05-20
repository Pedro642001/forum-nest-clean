import { Either, right } from "@/core/either/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";

interface ListAnswerCommentsInput {
	answerId: string;
	page: number;
}

type ListAnswerCommentsOutput = Either<
	null,
	{ answerComments: AnswerComment[] }
>;

@Injectable()
export class ListAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		answerId,
		page,
	}: ListAnswerCommentsInput): Promise<ListAnswerCommentsOutput> {
		const answerComments =
			await this.answerCommentsRepository.findManyByAnswerId(answerId, {
				page,
			});

		return right({ answerComments });
	}
}
