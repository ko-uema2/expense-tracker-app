import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components/ui";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

// ジェネリックでformとnameを受け取る
interface EmailProps<T extends FieldValues> {
	form: UseFormReturn<T>;
	disabled?: boolean;
}
export const Email = <T extends FieldValues>({
	form,
	disabled,
}: EmailProps<T>) => (
	<FormField
		control={form.control}
		name={"email" as Path<T>}
		render={({ field }) => (
			<FormItem>
				<FormLabel>メールアドレス</FormLabel>
				<FormControl>
					<Input
						id="email"
						type="email"
						placeholder="your@email.com"
						className="h-12 box-border"
						disabled={disabled}
						{...field}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);
