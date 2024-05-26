/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ExpenseData = {
  __typename: "ExpenseData",
  id: string,
  userId: string,
  expenseDate: string,
  regFixedCost: number,
  irregFixedCost: number,
  regVarCost: number,
  irregVarCost: number,
};

export type GetExpDataQueryVariables = {
  userId?: string | null,
};

export type GetExpDataQuery = {
  getExpData?:  Array< {
    __typename: "ExpenseData",
    id: string,
    userId: string,
    expenseDate: string,
    regFixedCost: number,
    irregFixedCost: number,
    regVarCost: number,
    irregVarCost: number,
  } | null > | null,
};
