import { SignOut } from "@/features/auth/components/SignOut";
import { useAuth } from "@/hooks/useAuth";
import {
  AppShell,
  Burger,
  Code,
  Group,
  ScrollArea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC, ReactNode, memo } from "react";
import { Navigate, RouteObject } from "react-router-dom";

const App: FC = memo(() => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      className="p-4"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header className="border-b border-base-300">
        <Group className="h-full px-2 justify-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title className="text-primary-700" order={2}>
            Expense Tracker
          </Title>
          <Code className="mr-2" fw={700}>
            v1.0.0
          </Code>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className="p-4 border-r border-base-300">
        <AppShell.Section>
          <Group className="justify-between h-10">
            <Title className="ml-2 text-base-700 text-lg">Collections</Title>
          </Group>
        </AppShell.Section>
        <AppShell.Section
          className="my-4"
          grow
          component={ScrollArea}
        ></AppShell.Section>
        <AppShell.Section>
          <div className="pt-3 border-t border-base-300">
            <SignOut />
          </div>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main></AppShell.Main>
    </AppShell>
  );
});

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: FC<PrivateRouteProps> = memo(({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
});

/**
 * Represents an array of private routes.
 */
export const privateRoutes: RouteObject[] = [
  {
    path: "/app",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
];
