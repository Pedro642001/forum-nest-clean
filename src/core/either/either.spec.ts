import { type Either, left, right } from "./either";

function doSomething(x: boolean): Either<string, string> {
	if (x) {
		return right("success");
	}
	return left("error");
}
test("success result", () => {
	const successResult = doSomething(true);

	expect(successResult.isRight()).toEqual(true);
});

test("error result", () => {
	const error = left("error");

	expect(error.isLeft()).toEqual(true);
});
