import { AuthRoutes } from "@/features/auth/routes";

/**
 * Represents an array of public routes.
 */
export const publicRoutes = [
  {
    path: "/auth/*",
    element: <AuthRoutes />,
  },
];
