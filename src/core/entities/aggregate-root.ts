import type { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

export abstract class AggregateRoot<Props> extends Entity<Props> {
	private _domainEvents: DomainEvent[] = [];

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: DomainEvent) {
		this._domainEvents.push(domainEvent);
		DomainEvents.markAggregateForDispatch(this);
	}

	equals(aggregate: AggregateRoot<unknown>) {
		if (aggregate === this) {
			return true;
		}

		return false;
	}

	clearEvents() {
		this._domainEvents = [];
	}
}
