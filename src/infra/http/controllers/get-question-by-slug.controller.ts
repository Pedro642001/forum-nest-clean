import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param
} from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";


@Controller("/questions/:slug")
export class GetQuestionBySlugController {
	constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

	@Get()
	async handle(
    @Param('slug')
    slug: string
  ) {
		const result = await this.getQuestionBySlug.execute({
			slug
		});

		if (result.isLeft()) {
      const error = result.value
			
      switch(error.constructor){
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException
      }
		}

		const { question } = result.value;

		return { question: QuestionPresenter.toHTTP(question) };
	}
}
