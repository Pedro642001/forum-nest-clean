import { Either, left, right } from "@/core/either/either";
import type { Answer } from "../../enterprise/entities/answer";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface EditAnswerInput {
	answerId: string;
	authorId: string;
	content: string;
	attachmentIds: Array<string>;
}

type EditAnswerOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{ answer: Answer }
>;

@Injectable()
export class EditAnswerUseCase {
	constructor(
		private answerAttachmentRepository: AnswerAttachmentsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute({
		answerId,
		authorId,
		content,
		attachmentIds,
	}: EditAnswerInput): Promise<EditAnswerOutput> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.value !== authorId) {
			return left(new NotAllowedError());
		}

		const currentAnswerAttachments =
			await this.answerAttachmentRepository.findManyByAnswerId(answerId);

		const answerAttachmentList = new AnswerAttachmentList(
			currentAnswerAttachments,
		);

		const answerAttachment = attachmentIds.map((id) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(id),
				answerId: answer.id,
			});
		});

		answerAttachmentList.update(answerAttachment);

		answer.content = content;
		answer.attachments = answerAttachmentList;

		await this.answersRepository.update(answer);

		return right({ answer });
	}
}
