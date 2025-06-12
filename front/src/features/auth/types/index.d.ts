import type {
	confirmAccountInfoSchema,
	signInInfoSchema,
	signUpInfoSchema,
} from "@/utils/schema";
import type { z } from "zod";

export type AuthInfo =
	| z.infer<typeof signInInfoSchema>
	| z.infer<typeof signUpInfoSchema>;

export type SignInInfo = z.infer<typeof signInInfoSchema>;

export type SignUpInfo = z.infer<typeof signUpInfoSchema>;

export type ConfirmationInfo = z.infer<typeof confirmationInfoSchema>;
