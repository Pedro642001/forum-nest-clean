import type { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";


export class QuestionCommentsRepositoryInMemory implements QuestionCommentsRepository {

  public items: Array<QuestionComment> = [];

  async create(question: QuestionComment): Promise<void> {
    this.items.push(question);

    return;
  }

  async update(question: QuestionComment): Promise<void> {
    const questionIndex = this.items.indexOf(question);

    this.items[questionIndex] = question;
  }

  async delete(question: QuestionComment): Promise<void> {
    const questionIndex = this.items.indexOf(question);

    this.items.splice(questionIndex, 1);
  }

  async findById(questionId: string): Promise<QuestionComment | null> {

    const question = this.items.find((item) => item.id.value === questionId);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams): Promise<QuestionComment[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
};