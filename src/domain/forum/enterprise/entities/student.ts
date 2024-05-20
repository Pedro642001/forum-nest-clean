import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface StudentProps {
	name: string;
	email: string;
	password: string;
}

export class Student extends Entity<StudentProps> {
	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	static create(props: StudentProps, id?: UniqueEntityID) {
		return new Student(props, id);
	}
}