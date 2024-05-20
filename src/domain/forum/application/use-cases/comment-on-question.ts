import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Either, left, right } from "@/core/either/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface CommentOnQuestionInput {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionOutput = Either<
	ResourceNotFoundError,
	{ questionComment: QuestionComment }
>;

@Injectable()
export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository,
	) {}

	async execute({
		authorId,
		content,
		questionId,
	}: CommentOnQuestionInput): Promise<CommentOnQuestionOutput> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityID(authorId),
			content: content,
			questionId: question.id,
		});

		this.questionCommentsRepository.create(questionComment);

		return right({ questionComment });
	}
}
