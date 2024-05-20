import { Question } from "@/domain/forum/enterprise/entities/question";

export class QuestionPresenter {
	static toHTTP(question: Question) {
		return {
			id: question.id.value,
			title: question.title,
			content: question.content,
			slug: question.slug.value,
			bestAnswerId: question.bestAnswerId?.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}
