/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getExpData = /* GraphQL */ `query GetExpData($userId: String!) {
  getExpData(userId: $userId) {
    userId
    expenseDate
    regFixedCost
    irregFixedCost
    regVarCost
    irregVarCost
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetExpDataQueryVariables,
  APITypes.GetExpDataQuery
>;
