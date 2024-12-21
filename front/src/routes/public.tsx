import { Error500WithinPubliceRoute } from "@/components/error";
import { AuthRoutes } from "@/features/auth/routes";
import { ErrorBoundary } from "react-error-boundary";

/**
 * Represents an array of public routes.
 */
export const publicRoutes = [
	{
		path: "/auth/*",
		element: (
			<ErrorBoundary FallbackComponent={Error500WithinPubliceRoute}>
				<AuthRoutes />
			</ErrorBoundary>
		),
	},
];
