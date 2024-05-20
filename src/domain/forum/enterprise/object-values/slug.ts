export class Slug {
	readonly value: string;

	constructor(value: string) {
		this.value = value;
	}

	static create(value: string) {
		return new Slug(value);
	}
	/**
	 *  Recive a string and normalize it as a slug.
	 *
	 * Exemple: "An exemple title" -> "an-exemple-title"
	 *
	 *
	 * @param text {string}
	 */
	static createFromText(text: string) {
		const slugText = text
			.normalize("NFKD")
			.toLocaleLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/_/g, "-")
			.replace(/--+/g, "-")
			.replace(/-$/g, "");

		return new Slug(slugText);
	}
}
