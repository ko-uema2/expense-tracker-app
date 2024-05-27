import { GetExpDataQueryVariables } from "@/API";
import { Loading } from "@/components/form";
import { SignOut } from "@/features/auth/components/SignOut";
import { getExpData } from "@/graphql/queries";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  AppShell,
  Burger,
  Code,
  Group,
  Loader,
  ScrollArea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { generateClient } from "aws-amplify/api";
import { FC, ReactNode, Suspense, memo } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import useSWR from "swr";

const graphqlClient = generateClient();
const queryInput: GetExpDataQueryVariables = { userId: "user1" };
const fetchExpData = async () =>
  graphqlClient
    .graphql({
      query: getExpData,
      variables: queryInput,
    })
    .then((res) => {
      return res;
    });

const FetchData: FC = memo(() => {
  const { data, error } = useSWR("dimmyURL", fetchExpData, { suspense: true });
  console.log(data, error);

  return (
    <>
      {!data ? (
        <div>no data</div>
      ) : (
        data.data.getExpData?.map((item) => (
          <div key={item?.id}>
            <div>{item?.expenseDate}</div>
            <div>{item?.regFixedCost}</div>
            <div>{item?.irregFixedCost}</div>
            <div>{item?.regVarCost}</div>
            <div>{item?.irregVarCost}</div>
            <br />
          </div>
        ))
      )}
    </>
  );
});

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
      <AppShell.Main>
        <Suspense fallback={<div>Loading...</div>}>
          <FetchData />
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
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },
];
