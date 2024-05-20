import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class AnswerAttachmentsRepositoryInMemory implements AnswerAttachmentsRepository {

  public items: Array<AnswerAttachment> = [];

  async create(answerAttachment: AnswerAttachment): Promise<void> {
    this.items.push(answerAttachment);

    return;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const questionAttachments = this.items
      .filter((item) => item.answerId.value !== answerId);

    this.items = questionAttachments;
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = this.items
      .filter((item) => item.answerId.value === answerId);

    return answerAttachments;
  }

};