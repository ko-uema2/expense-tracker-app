import { privateRoutes } from "@/routes/PrivateRoutes";
import { publicRoutes } from "@/routes/PublicRoutes.";
import type { FC } from "react";
import { Navigate, useRoutes } from "react-router-dom";

/**
 * アプリ全体のルーティングを統括するエントリーポイント。
 * 公開・認証済みルートを統合し、NotFoundリダイレクトも管理。
 */
export const AppRouter: FC = () => {
	const element = useRoutes([
		...publicRoutes,
		...privateRoutes,
		{ path: "*", element: <Navigate to="/auth/signin" replace /> },
	]);
	return <>{element}</>;
};
