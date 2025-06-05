import { SignIn, SignUp } from "@/features/auth";
import { ServerErrorPage } from "@/features/error";
import type { PublicRoutes as PublicRoutesProps } from "@/routes";
import type { FC } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, type RouteObject, Routes } from "react-router-dom";

/**
 * Renders the routes for authentication.
 * @returns The authentication routes.
 */
export const AuthRoutes = () => {
	return (
		<Routes>
			<Route path="signup" element={<SignUp />} />
			<Route path="signin" element={<SignIn />} />
		</Routes>
	);
};

const PublicRoutes: FC<PublicRoutesProps> = ({ children }) => {
	return <>{children}</>;
};

/**
 * Represents an array of public routes.
 */
export const publicRoutes: RouteObject[] = [
	{
		path: "/auth/*",
		element: (
			<ErrorBoundary FallbackComponent={ServerErrorPage}>
				<PublicRoutes>
					<AuthRoutes />
				</PublicRoutes>
			</ErrorBoundary>
		),
	},
];
