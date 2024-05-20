import { Module } from "@nestjs/common";
import { Encrypter } from "@/domain/forum/application/gateways/encrypter";
import { JwtEncrypter } from "./jwt-encrypter-gateway";
import { BcryptHasher } from "./bcrypt-hasher-gateway";
import { HashComparer } from "@/domain/forum/application/gateways/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/gateways/hash-generator";

@Module({
	providers: [
		{ provide: Encrypter, useClass: JwtEncrypter },
		{ provide: HashComparer, useClass: BcryptHasher },
		{ provide: HashGenerator, useClass: BcryptHasher },
	],
	exports: [Encrypter, HashComparer, HashGenerator],
})
export class GatewaysModule {}
