import validator from "validator";
import { doesUserExist } from "../users/validation_funcs.js";
import { getAccountById } from "./get_funcs.js";

export const TRANSACTIONS = {
  DEPOSITE: "deposite",
  WITHDRAW: "withdraw",
  CREDIT: "credit",
  TRANSFER: "transfer",
};

export const doesAccountExist = (accountId) => {
  const account = getAccountById(accountId);
  return account ? true : false;
};

export const doesAccountBelongToUser = (userId, accountId) => {
  const account = getAccountById(accountId);
  return account.ownersId.some((ownerId) => ownerId === userId);
};

export const isAccountActive = (accountId) => {
  const account = getAccountById(accountId);
  return account.isActive;
};

export const canWithdrawFromAccount = (accountId, amount) => {
  const account = getAccountById(accountId);
  return amount <= account.credit + account.cash;
};

export const checkUserAndAccount = (userId, accountId) => {
  if (!doesUserExist(userId)) {
    throw new Error("User doesn't exist");
  }
  if (
    !doesAccountExist(accountId) ||
    !doesAccountBelongToUser(userId, accountId)
  )
    throw new Error(
      `User ${userId} doesn't own an account with the id ${accountId}`
    );
  if (!isAccountActive(accountId))
    throw new Error(
      `Can't complete that action. Account ${accountId} is inactive`
    );
};

export const isValidTransaction = (accountId, amount, action) => {
  if (action === "withdraw" || action === "transfer") {
    if (!canWithdrawFromAccount(accountId, amount)) {
      throw new Error(
        `Can't complete the action. Amount exceeds the maximum amount you can withdraw from this account`
      );
    }
  }
  if (amount < 0) {
    throw new Error(
      `Can't complete the action. The ${action} amount shouldn't be negetive`
    );
  }
};

export const doesAccountHaveCashOrInDebt = (accountId) => {
  const account = getAccountById(accountId);
  return account.cash !== 0;
};

export const validateAccountCashOrCredit = (input) => {
  if (!input || !validator.isNumeric(input.toString())) return 0;
  return input;
};
