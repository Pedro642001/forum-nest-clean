import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface CommentProps {
	authorId: UniqueEntityID;
	content: string;
	createdAt: Date;
	updatedAt?: Date | null;
}

export abstract class Comment<
	Props extends CommentProps,
> extends Entity<Props> {
	get content() {
		return this.props.content;
	}

	get authorId() {
		return this.props.authorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat("...");
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}
}
