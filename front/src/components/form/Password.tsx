import { IconButton } from "@/components/button/IconButton";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface PasswordProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	disabled?: boolean;
}

export const Password = <T extends FieldValues>({
	form,
	disabled,
}: PasswordProps<T>) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<FormField
			control={form.control}
			name={"password" as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormLabel>パスワード</FormLabel>
					<FormControl>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="パスワードを入力"
								className="h-12 box-border"
								disabled={disabled}
								{...field}
							/>
							<IconButton
								icon={
									showPassword ? (
										<Eye className="w-5 h-5 text-gray-400" />
									) : (
										<EyeOff className="w-5 h-5 text-gray-400" />
									)
								}
								variant="ghost"
								size="icon"
								onClick={() => setShowPassword((v) => !v)}
								disabled={disabled}
								className="absolute inset-y-0 right-0 flex items-center h-full bg-transparent"
								aria-label={
									showPassword ? "パスワードを非表示" : "パスワードを表示"
								}
							/>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
