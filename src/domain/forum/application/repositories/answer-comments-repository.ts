import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export abstract class AnswerCommentsRepository {
	abstract create(answerComment: AnswerComment): Promise<void>;
	abstract update(answerComment: AnswerComment): Promise<void>;
	abstract delete(answerComment: AnswerComment): Promise<void>;
	abstract findById(answerComment: string): Promise<AnswerComment | null>;
	abstract findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>;
}
