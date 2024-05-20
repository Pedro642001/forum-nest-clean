import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class QuestionAttachmentsRepositoryInMemory implements QuestionAttachmentsRepository {
  public items: Array<QuestionAttachment> = [];

  async create(questionAttachment: QuestionAttachment): Promise<void> {
    this.items.push(questionAttachment);

    return;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items
      .filter((item) => item.questionId.value !== questionId);

    this.items = questionAttachments;
  }


  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const questionAttachments = this.items
      .filter((item) => item.questionId.value === questionId);

    return questionAttachments;
  }
};