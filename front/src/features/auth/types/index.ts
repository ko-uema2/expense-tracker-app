import { authInfoSchema } from "@/utils/schema";
import { z } from "zod";

export type AuthInfo = z.infer<typeof authInfoSchema>;
