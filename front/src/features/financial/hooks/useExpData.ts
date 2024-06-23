import { GetExpDataQuery, GetExpDataQueryVariables } from "@/API";
import { getExpData } from "@/graphql/queries";
import { GraphQLResult, generateClient } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import useSWR from "swr";

const fetchExpData = async () => {
  const graphqlClient = generateClient();
  const session = await fetchAuthSession();
  if (!session || !session.userSub) {
    throw new Error("No userSub found in session");
  }
  const queryInput: GetExpDataQueryVariables = { userId: session.userSub };

  return graphqlClient
    .graphql({
      query: getExpData,
      variables: queryInput,
    })
    .then((res) => {
      return res;
    });
};

export const useExpData = (): {
  data: GraphQLResult<GetExpDataQuery>;
  error: Error | undefined;
} => {
  return useSWR("dummyURL", fetchExpData, { suspense: true });
};
