import { Either, right } from "@/core/either/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Injectable } from "@nestjs/common";

interface ListRecentQuestionsInput {
	page: number;
}

type ListRecentQuestionsOutput = Either<
	null,
	{
		questions: Question[];
	}
>;

@Injectable()
export class ListRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: ListRecentQuestionsInput): Promise<ListRecentQuestionsOutput> {
		const questions = await this.questionsRepository.findManyRecent({
			page,
		});

		return right({
			questions,
		});
	}
}
