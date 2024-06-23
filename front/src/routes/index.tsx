import React from "react";
import { privateRoutes } from "@/routes/private";
import { publicRoutes } from "@/routes/public";
import { Navigate, useRoutes } from "react-router-dom";

/**
 * Renders the appropriate routes based on the authentication status.
 * If authenticated, renders private routes. Otherwise, renders public routes.
 *
 * @returns The rendered routes.
 */
export const AppRoutes = () => {
  const element = useRoutes([
    ...publicRoutes,
    ...privateRoutes,
    { path: "*", element: <Navigate to="/auth/signin" replace /> },
  ]);

  return <>{element}</>;
};
