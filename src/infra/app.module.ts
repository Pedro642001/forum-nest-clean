import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EnvModule } from "./env/env.module";
import { HttpModule } from "./http/http.module";

@Module({
	imports: [EnvModule, AuthModule, HttpModule],
})
export class AppModule {}
