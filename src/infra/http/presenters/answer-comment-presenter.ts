import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class AnswerCommentPresenter {
	static toHTTP(answerComment: AnswerComment) {
		return {
			id: answerComment.id.value,
			answerId: answerComment.answerId,
			authorId: answerComment.authorId,
			content: answerComment.content,
			createdAt: answerComment.createdAt,
			updatedAt: answerComment.updatedAt,
		};
	}
}
