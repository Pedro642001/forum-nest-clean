import { Either, left, right } from "@/core/either/either";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerCommentInput {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>;

@Injectable()
export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		answerCommentId,
		authorId,
	}: DeleteAnswerCommentInput): Promise<DeleteAnswerCommentOutput> {
		const answerComment =
			await this.answerCommentsRepository.findById(answerCommentId);

		if (!answerComment) {
			return left(new ResourceNotFoundError());
		}

		if (authorId !== answerComment.authorId.value) {
			return left(new NotAllowedError());
		}

		await this.answerCommentsRepository.delete(answerComment);

		return right(null);
	}
}
