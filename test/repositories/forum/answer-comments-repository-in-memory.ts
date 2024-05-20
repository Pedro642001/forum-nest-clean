import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";


export class AnswerCommentsRepositoryInMemory implements AnswerCommentsRepository {
  public items: Array<AnswerComment> = [];

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);

    return;
  }

  async update(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.indexOf(answerComment);

    this.items[answerCommentIndex] = answerComment;
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.indexOf(answerComment);

    this.items.splice(answerCommentIndex, 1);
  }

  async findById(answerCommentId: string): Promise<AnswerComment | null> {

    const answerComment = this.items.find((item) => item.id.value === answerCommentId);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    const questionComments = this.items
      .filter((item) => item.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
};