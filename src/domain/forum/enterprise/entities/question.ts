import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Slug } from "../object-values/slug";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChooseEvent } from "../events/question-best-answer-choose-event";

export interface QuestionProps {
	authorId: UniqueEntityID;
	bestAnswerId?: UniqueEntityID | null;
	title: string;
	content: string;
	slug: Slug;
	attachments: QuestionAttachmentList;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Question extends AggregateRoot<QuestionProps> {
	get authorId() {
		return this.props.authorId;
	}

	get slug() {
		return this.props.slug;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get title() {
		return this.props.title;
	}

	get content() {
		return this.props.content;
	}

	get attachments() {
		return this.props.attachments;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get isNew() {
		const currentDate = new Date();
		const dayInMs = 1000 * 60 * 60 * 24;
		const diffInMs = Math.abs(
			currentDate.getTime() - this.props.createdAt.getTime(),
		);
		const diffInDays = diffInMs / dayInMs;

		return diffInDays <= 3;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createFromText(title);
		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
		if (bestAnswerId === undefined || bestAnswerId === null) {
			return;
		}

		if (
			this.props.bestAnswerId === undefined ||
			this.props.bestAnswerId === null ||
			!bestAnswerId.equals(this.props.bestAnswerId)
		) {
			this.addDomainEvent(
				new QuestionBestAnswerChooseEvent(this, bestAnswerId),
			);
		}

		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(
		props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
		id?: UniqueEntityID,
	) {
		return new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? new QuestionAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
	}
}
