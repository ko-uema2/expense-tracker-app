import { Error500WithinPrivateRoute } from "@/components/error";
import { Loading } from "@/components/form";
import { Financial } from "@/features/financial";
import { Header } from "@/components/layouts";
import { Menu } from "@/features/menu/components/Menu";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, ReactNode, Suspense, memo } from "react";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, RouteObject } from "react-router-dom";

const App: FC = memo(() => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      className="p-4"
      header={{ height: 60 }}
      navbar={{
        width: { base: 200 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      withBorder={false}
      padding={{ base: 5 }}
    >
      <AppShell.Header className="bg-base-50">
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar className="p-4 bg-base-50">
        <AppShell.Section>
          <Menu />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main className="">
        <Suspense fallback={<div>Loading...</div>}>
          <Financial />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
});

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: FC<PrivateRouteProps> = memo(({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { loading, isValid, error } = useAuthToken();

  // TODO: 有効期限チェックにてエラーが発生した場合、エラーメッセージ記載用のコンポーネントを追加する

  return (
    <>
      {(authStatus === "configuring" || loading) && (
        <Loading loading={loading} />
      )}
      {authStatus === "unauthenticated" && (
        <Navigate to="/auth/signin" replace />
      )}
      {authStatus === "authenticated" && !loading && isValid && children}
      {authStatus === "authenticated" && !loading && !isValid && (
        <Navigate to="/auth/signin" replace />
      )}
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
      <ErrorBoundary FallbackComponent={Error500WithinPrivateRoute}>
        <PrivateRoute>
          <App />
        </PrivateRoute>
      </ErrorBoundary>
    ),
  },
];

App.displayName = "App";
PrivateRoute.displayName = "PrivateRoute";
