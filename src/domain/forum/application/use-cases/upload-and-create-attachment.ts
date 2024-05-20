import { Either, left, right } from "@/core/either/either";
import { Injectable } from "@nestjs/common";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";
import { Uploader } from "../gateways/uploader";

interface UploadAndCreateAttachmentInput {
	fileName: string;
	fileType: string;
	body: Buffer;
}

type UploadAndCreateAttachmentOutput = Either<
	InvalidAttachmentTypeError,
	{ attachment: Attachment }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private attachmentRepository: AttachmentsRepository,
		private uploaderGateway: Uploader,
	) {}

	async execute({
		body,
		fileName,
		fileType,
	}: UploadAndCreateAttachmentInput): Promise<UploadAndCreateAttachmentOutput> {
		if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
			return left(new InvalidAttachmentTypeError());
		}

		const { url } = await this.uploaderGateway.upload({
			body,
			fileName,
			fileType,
		});

		const attachment = Attachment.create({
			title: fileName,
			url,
		});

		await this.attachmentRepository.create(attachment);

		return right({ attachment });
	}
}
