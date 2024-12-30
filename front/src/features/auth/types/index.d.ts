import type { authInfoSchema } from "@/utils/schema";
import type { z } from "zod";

export type AuthInfo = z.infer<typeof authInfoSchema>;
