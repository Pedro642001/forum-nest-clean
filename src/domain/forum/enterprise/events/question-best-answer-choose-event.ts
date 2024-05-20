import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Question } from "../entities/question";

export class QuestionBestAnswerChooseEvent implements DomainEvent {
	ocurredAt: Date;
	question: Question;
	bestAnswerId: UniqueEntityID;

	constructor(question: Question, bestAnswerId: UniqueEntityID) {
		this.question = question;
		this.bestAnswerId = bestAnswerId;
		this.ocurredAt = new Date();
	}

	getAggregateId(): UniqueEntityID {
		return this.question.id;
	}
}
