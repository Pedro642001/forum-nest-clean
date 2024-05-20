import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class AnswerPresenter {
	static toHTTP(answer: Answer) {
		return {
			id: answer.id.value,
			authorId: answer.authorId.value,
			questionId: answer.questionId.value,
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}
