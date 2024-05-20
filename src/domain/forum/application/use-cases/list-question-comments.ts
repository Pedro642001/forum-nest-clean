import { Either, right } from "@/core/either/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Injectable } from "@nestjs/common";

interface ListQuestionCommentsInput {
	questionId: string;
	page: number;
}

type ListQuestionCommentsOutput = Either<
	null,
	{ questionComments: QuestionComment[] }
>;

@Injectable()
export class ListQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: ListQuestionCommentsInput): Promise<ListQuestionCommentsOutput> {
		const questionComments =
			await this.questionCommentsRepository.findManyByQuestionId(questionId, {
				page,
			});

		return right({ questionComments });
	}
}
