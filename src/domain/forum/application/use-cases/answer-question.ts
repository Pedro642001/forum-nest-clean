import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { type Either, right } from "@/core/either/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { Injectable } from "@nestjs/common";

interface AnswerQuestionInput {
	instructorId: string;
	content: string;
	questionId: string;
	attachmentIds: string[];
}

type AnswerQuestionOutput = Either<null, { answer: Answer }>;

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		instructorId,
		questionId,
		content,
		attachmentIds,
	}: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(instructorId),
			questionId: new UniqueEntityID(questionId),
		});

		const answerAttachments = attachmentIds.map((id) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(id),
				answerId: answer.id,
			});
		});

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
