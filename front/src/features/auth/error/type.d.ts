import type {
	AuthErrorCodes,
	SignInException,
	SignUpException,
} from "@/features/auth/error/const";
import type { ErrorDefinition } from "@/utils/error";

export type AuthErrorDefinition = ErrorDefinition<AuthErrorCodes>;

export type AuthException = SignInException | SignUpException;
