import { readFileSync } from "fs";
import { FakeUploader } from "test/gateways/fake-uploader";
import { AttachmentsRepositoryInMemory } from "test/repositories/forum/attachments-repository-in-memory";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

let attachmentRepository: AttachmentsRepositoryInMemory;
let uploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
	beforeEach(() => {
		attachmentRepository = new AttachmentsRepositoryInMemory();
    uploader = new FakeUploader()
    
		sut = new UploadAndCreateAttachmentUseCase(
      attachmentRepository,
      uploader
    );
	});

	it("Should be able to create a new attachment", async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      fileName: 'image.png',
      fileType: 'image/png'
    })

    expect(result.isRight()).toBe(true)
    
    if(result.isRight()){
      expect(result.value.attachment.url).toBe(uploader.items[0].url)
    }
    
	});

  it("Should not be able to create an attachment with invalid type", async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
	});
});
