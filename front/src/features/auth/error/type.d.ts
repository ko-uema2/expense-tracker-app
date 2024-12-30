import type { AuthErrorCodes } from "@/features/auth/error/const";
import type { ErrorDefinition } from "@/utils/error";

export type AuthErrorDefinition = ErrorDefinition<AuthErrorCodes>;
