import { SignIn } from "@/features/auth/components/SignIn";
import { SignUp } from "@/features/auth/components/SignUp";
import { Route, Routes } from "react-router-dom";

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
