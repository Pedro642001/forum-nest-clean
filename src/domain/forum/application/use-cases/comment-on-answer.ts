import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Either, left, right } from "@/core/either/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { AnswersRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";

interface CommentOnAnswerInput {
	authorId: string;
	content: string;
	answerId: string;
}

type CommentOnAnswerOutput = Either<
	ResourceNotFoundError,
	{ answerComment: AnswerComment }
>;

@Injectable()
export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerInput): Promise<CommentOnAnswerOutput> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		const answerComment = AnswerComment.create({
			answerId: new UniqueEntityID(answerId),
			authorId: new UniqueEntityID(authorId),
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({ answerComment });
	}
}
