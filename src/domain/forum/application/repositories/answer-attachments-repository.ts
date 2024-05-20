import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export abstract class AnswerAttachmentsRepository {
	abstract deleteManyByAnswerId(AnswerId: string): Promise<void>;
	abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
