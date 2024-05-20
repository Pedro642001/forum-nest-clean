import { Module } from "@nestjs/common";
import { DatabaseModule } from "../databases/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { ListRecentQuestionsController } from "./controllers/list-recent-questions.controller";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { ListRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/list-recent-questions";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { CreateStudentUseCase } from "@/domain/forum/application/use-cases/create-student";
import { GatewaysModule } from "../gateways/gateways.module";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { ListQuestionAnswersController } from "./controllers/list-question-answers.controller";
import { ListQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/list-question-answers";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controller";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { ListQuestionCommentsController } from "./controllers/list-question-comments.controller";
import { ListQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/list-question-comments";
import { ListAnswerCommentsController } from "./controllers/list-answer-comments.controller";
import { ListAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/list-answer-comments";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";

@Module({
	imports: [DatabaseModule, GatewaysModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		ListRecentQuestionsController,
		GetQuestionBySlugController,
		EditQuestionController,
		DeleteQuestionController,
		AnswerQuestionController,
		EditAnswerController,
		DeleteAnswerController,
		ListQuestionAnswersController,
		ChooseQuestionBestAnswerController,
		CommentOnQuestionController,
		DeleteQuestionCommentController,
		CommentOnAnswerController,
		DeleteAnswerCommentController,
		ListQuestionCommentsController,
		ListAnswerCommentsController,
		UploadAttachmentController,
	],
	providers: [
		CreateQuestionUseCase,
		GetQuestionBySlugUseCase,
		ListRecentQuestionsUseCase,
		CreateStudentUseCase,
		AuthenticateStudentUseCase,
		EditQuestionUseCase,
		DeleteQuestionUseCase,
		AnswerQuestionUseCase,
		EditAnswerUseCase,
		DeleteAnswerUseCase,
		ListQuestionAnswersUseCase,
		ChooseQuestionBestAnswerUseCase,
		CommentOnQuestionUseCase,
		DeleteQuestionCommentUseCase,
		CommentOnAnswerUseCase,
		DeleteAnswerCommentUseCase,
		ListQuestionCommentsUseCase,
		ListAnswerCommentsUseCase,
	],
})
export class HttpModule {}
