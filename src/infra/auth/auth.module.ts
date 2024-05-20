import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvService } from "../env/env.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { EnvModule } from "../env/env.module";

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			global: true,
			useFactory(config: EnvService) {
				const privateKey = config.get("JWT_PRIVATE_KEY");
				const publicKey = config.get("JWT_PUBLIC_KEY");

				return {
					signOptions: { algorithm: "RS256" },
					privateKey: Buffer.from(privateKey, "base64"),
					publicKey: Buffer.from(publicKey, "base64"),
				};
			},
		}),
	],
	providers: [
		JwtStrategy,
		EnvService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AuthModule { }
