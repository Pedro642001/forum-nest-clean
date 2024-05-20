import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";

@Module({
	providers: [
		PrismaService,
		{
			provide: AnswerAttachmentsRepository,
			useClass: PrismaAnswerAttachmentsRepository,
		},
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: AnswerCommentsRepository,
			useClass: PrismaAnswerCommentsRepository,
		},
		{
			provide: AnswersRepository,
			useClass: PrismaAnswersRepository,
		},
		{
			provide: QuestionCommentsRepository,
			useClass: PrismaQuestionCommentsRepository,
		},
		{
			provide: QuestionAttachmentsRepository,
			useClass: PrismaQuestionAttachmentsRepository,
		},
		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		QuestionAttachmentsRepository,
		QuestionCommentsRepository,
		AnswersRepository,
		AnswerAttachmentsRepository,
		AnswerCommentsRepository,
		StudentsRepository,
	],
})
export class DatabaseModule {}
