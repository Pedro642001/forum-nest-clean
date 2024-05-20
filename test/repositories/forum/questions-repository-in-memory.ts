import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionsRepositoryInMemory implements QuestionsRepository {
	constructor(
		private questionAttachmentRepository: QuestionAttachmentsRepository,
	) {}

	public items: Array<Question> = [];

	async create(question: Question): Promise<void> {
		this.items.push(question);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async update(question: Question): Promise<void> {
		const questionIndex = this.items.indexOf(question);

		this.items[questionIndex] = question;

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const questionIndex = this.items.indexOf(question);

		this.items.splice(questionIndex, 1);

		await this.questionAttachmentRepository.deleteManyByQuestionId(
			question.id.value,
		);
	}

	async findById(questionId: string): Promise<Question | null> {
		const question = this.items.find((item) => item.id.value === questionId);

		if (!question) {
			return null;
		}

		return question;
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) {
			return null;
		}

		return question;
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}
}
