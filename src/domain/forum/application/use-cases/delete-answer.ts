import { Either, left, right } from "@/core/either/either";
import { AnswersRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerInput {
	answerId: string;
	authorId: string;
}

type DeleteAnswerOutput = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		answerId,
		authorId,
	}: DeleteAnswerInput): Promise<DeleteAnswerOutput> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundError());
		}

		if (answer.authorId.value !== authorId) {
			return left(new NotAllowedError());
		}

		await this.answersRepository.delete(answer);

		return right(null);
	}
}
