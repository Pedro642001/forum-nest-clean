import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { type Either, right } from "@/core/either/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

interface CreateQuestionInput {
	authorId: string;
	title: string;
	content: string;
	attachmentIds: string[];
}

type CreateQuestionOutput = Either<null, { question: Question }>;

@Injectable()
export class CreateQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		authorId,
		content,
		title,
		attachmentIds,
	}: CreateQuestionInput): Promise<CreateQuestionOutput> {
		const question = Question.create({
			authorId: new UniqueEntityID(authorId),
			content,
			title,
		});

		const questionAttachment = attachmentIds.map((id) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityID(id),
				questionId: question.id,
			});
		});

		question.attachments = new QuestionAttachmentList(questionAttachment);

		await this.questionsRepository.create(question);

		return right({ question });
	}
}
