import { UseCaseError } from "@/core/errors/use-case-error";

export class StudentAlreadyExists extends Error implements UseCaseError {
	constructor() {
		super("Student with same e-mail address already exists.");
	}
}
