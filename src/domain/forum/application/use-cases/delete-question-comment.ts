import { Either, left, right } from "@/core/either/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionCommentInput {
	questionCommentId: string;
	authorId: string;
}

type DeleteQuestionCommentOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

@Injectable()
export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionCommentId,
		authorId,
	}: DeleteQuestionCommentInput): Promise<DeleteQuestionCommentOutput> {
		const questionComment =
			await this.questionCommentsRepository.findById(questionCommentId);

		if (!questionComment) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== questionComment.authorId.value) {
			return left(new NotAllowedError());
		}

		await this.questionCommentsRepository.delete(questionComment);

		return right(null);
	}
}
