import { EnvService } from "@/infra/env/env.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

const userPayload = z.object({
	sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof userPayload>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(envService: EnvService) {
		const publicKey = envService.get("JWT_PUBLIC_KEY");

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: Buffer.from(publicKey as string, "base64"),
			algorithms: ["RS256"],
		});
	}

	async validate(payload: UserPayload) {
		return userPayload.parse(payload);
	}
}
