import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";

export class AttachmentsRepositoryInMemory implements AttachmentsRepository {
  public items: Array<Attachment> = [];
  
  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment);
  }
}
