import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
	public ocurredAt: Date;
	private aggregate: CustomAggregate;

	getAggregateId(): UniqueEntityID {
		return this.aggregate.id;
	}

	constructor(aggregate: CustomAggregate) {
		this.aggregate = aggregate;
		this.ocurredAt = new Date();
	}
}

class CustomAggregate extends AggregateRoot<unknown> {
	static create() {
		const aggregate = new CustomAggregate(null);

		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

		return aggregate;
	}
}

describe("domain events", () => {
	it("Should be able to dispatch and listen to events", () => {
		const callbackSpy = vi.fn();

		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

		const aggregate = CustomAggregate.create();

		expect(aggregate.domainEvents).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalledOnce();

		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
