import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerAttachment.create({
    attachmentId: new UniqueEntityID(),
    answerId: new UniqueEntityID(),
    ...override,
  }, id);
}
