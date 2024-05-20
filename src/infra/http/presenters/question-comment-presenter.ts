import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class QuestionCommentPresenter {
	static toHTTP(questionComment: QuestionComment) {
		return {
			id: questionComment.id.value,
			questionId: questionComment.questionId,
			authorId: questionComment.authorId,
			content: questionComment.content,
			createdAt: questionComment.createdAt,
			updatedAt: questionComment.updatedAt,
		};
	}
}
