import { UploadParams, Uploader } from "@/domain/forum/application/gateways/uploader";
import { randomUUID } from "crypto";

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public items: Array<Upload> = []

  async upload({fileName}: UploadParams): Promise<{ url: string; }> {
    const url = randomUUID()
    this.items.push({
      fileName,
      url
    })

    return { url }
  }
}