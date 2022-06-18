import fs from "fs";
import uniqid from "uniqid";
import { ACCOUNTS_PATH } from "../../data/data_dir_path.js";
import { getAccountIndexById, getAllAccounts } from "./get_funcs.js";
import { validateAccountCashOrCredit } from "./validation_funcs.js";

export const saveAccounts = (accounts) => {
  fs.writeFileSync(ACCOUNTS_PATH, JSON.stringify(accounts));
};

export const addAccount = (account) => {
  const accounts = getAllAccounts();
  accounts.push(account);
  saveAccounts(accounts);
};
export const depositeCash = (accountId, amount) => {
  const accounts = getAllAccounts();
  const accountIndex = getAccountIndexById(accountId);
  accounts[accountIndex].cash += amount;
  saveAccounts(accounts);
  return accounts[accountIndex];
};

export const withdrawCash = (accountId, amount) => {
  const accounts = getAllAccounts();
  const accountIndex = getAccountIndexById(accountId);
  accounts[accountIndex].cash -= amount;
  saveAccounts(accounts);
  return accounts[accountIndex];
};

export const updateCredit = (accountId, amount) => {
  const accounts = getAllAccounts();
  const accountIndex = getAccountIndexById(accountId);
  accounts[accountIndex].credit = amount;
  saveAccounts(accounts);
  return accounts[accountIndex];
};

export const updateAccountOwners = (ownerId, accountId) => {
  const accounts = getAllAccounts();
  const accountIndex = getAccountIndexById(accountId);
  accounts[accountIndex].ownersId.push(ownerId);
  saveAccounts(accounts);
};

export const deleteAccountById = (accountId) => {
  const accounts = getAllAccounts();
  const accountIndex = getAccountIndexById(accountId);
  const account = accounts[accountIndex];
  accounts.splice(accountIndex, 1);
  saveAccounts(accounts);
  return account;
};

export const removeUserIdFromAccount = (userId, accountId) => {
  const accounts = getAllAccounts();
  const accountIndex = getAccountIndexById(accountId);
  const userIdIndex = accounts[accountIndex].ownersId.findIndex(
    (ownderId) => ownderId === userId
  );
  accounts[accountIndex].ownersId.splice(userIdIndex, 1);

  if (accounts[accountIndex].ownersId.length === 0) {
    deleteAccountById(accountId);
  } else {
    saveAccounts(accounts);
  }
};

export const createAccount = (userId, cash, credit, isActive) => {
  const newAccount = {
    cash: validateAccountCashOrCredit(cash),
    credit: validateAccountCashOrCredit(credit),
    isActive: isActive === undefined ? true : isActive,
    accountId: uniqid(),
    ownersId: [userId],
  };
  return newAccount;
};
