import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { type Either, right, left } from "@/core/either/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";

interface EditQuestionInput {
	questionId: string;
	authorId: string;
	title: string;
	content: string;
	attachmentIds: string[];
}

type EditQuestionOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{ question: Question }
>;

@Injectable()
export class EditQuestionUseCase {
	constructor(
		private questionAttachmentRepository: QuestionAttachmentsRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({
		questionId,
		authorId,
		content,
		title,
		attachmentIds,
	}: EditQuestionInput): Promise<EditQuestionOutput> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (question.authorId.value !== authorId) {
			return left(new NotAllowedError());
		}

		const currentQuestionAttachments =
			await this.questionAttachmentRepository.findManyByQuestionId(questionId);

		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments,
		);

		const questionAttachment = attachmentIds.map((id) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(id),
				questionId: question.id,
			});
		});

		questionAttachmentList.update(questionAttachment);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentList;

		await this.questionsRepository.update(question);

		return right({ question });
	}
}
