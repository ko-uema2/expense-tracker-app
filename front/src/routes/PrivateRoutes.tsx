import { LoadingScreen } from "@/components/notification";
import { ServerErrorPage } from "@/features/error";
import { Dashboard, Header, Sidebar } from "@/features/home";
import { ExpenseProvider } from "@/features/home/components/dashboard/expense-context";
import type { PrivateRoutes as PrivateRoutesProps } from "@/routes";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { type FC, Suspense, memo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, type RouteObject } from "react-router-dom";
import { Toaster } from "sonner";

const MainRoutes: FC = memo(() => {
	return (
		<ExpenseProvider>
			<div className="flex flex-col h-screen bg-gray-50">
				<Header />{" "}
				<div className="flex flex-1 overflow-hidden">
					<Suspense fallback={<div>Loading...</div>}>
						<Sidebar />
					</Suspense>
					<main className="flex-1 overflow-auto">
						<Suspense fallback={<div>Loading...</div>}>
							<Dashboard />
						</Suspense>
					</main>
				</div>
			</div>
			<Toaster />
		</ExpenseProvider>
	);
});

const PrivateRoutes: FC<PrivateRoutesProps> = memo(({ children }) => {
	const { authStatus } = useAuthenticator((context) => [context.authStatus]);


	return (
		<>
			{authStatus === "configuring" && <LoadingScreen />}
			{authStatus === "unauthenticated" && (
				<Navigate to="/auth/signin" replace />
			)}
			{authStatus === "authenticated" && children}
		</>
	);
});

/**
 * Represents an array of private routes.
 */
export const privateRoutes: RouteObject[] = [
	{
		path: "/app",
		element: (
			<ErrorBoundary FallbackComponent={ServerErrorPage}>
				<PrivateRoutes>
					<MainRoutes />
				</PrivateRoutes>
			</ErrorBoundary>
		),
	},
];
