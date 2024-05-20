import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";


export class AnswersRepositoryInMemory implements AnswersRepository {
  public items: Array<Answer> = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) { }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);

    return;
  }

  async update(answer: Answer): Promise<void> {
    const answerIndex = this.items.indexOf(answer);

    this.items[answerIndex] = answer;
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.indexOf(answer);

    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.value
    );

    this.items.splice(answerIndex, 1);
  }

  async findById(answerId: string): Promise<Answer | null> {

    const answer = this.items.find((item) => item.id.value === answerId);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
    const answers = this.items
      .filter(item => item.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

};