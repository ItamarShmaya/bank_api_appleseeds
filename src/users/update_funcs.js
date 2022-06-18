import fs from "fs";
import uniqid from "uniqid";
import validator from "validator";
import { getAllUsers, getUserIndexById } from "./get_func.js";
import { USERS_PATH } from "../../data/data_dir_path.js";
import { getUserAccountsById } from "./get_func.js";
import { getAccountById } from "../accounts/get_funcs.js";
import { isValidName, isValidAccountsStructure } from "./validation_funcs.js";
import { doesAccountExist } from "../accounts/validation_funcs.js";
import { addAccount, updateAccountOwners } from "../accounts/update_funcs.js";

export const saveUsers = (users) => {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users));
};

const validateNumberInput = (input) => {
  if (!input || !validator.isNumeric(input.toString())) return 0;
  return input;
};

const createUserAccounts = (userId, accounts) => {
  return accounts.map((account) => {
    if (typeof account === "string") {
      if (doesAccountExist(account)) {
        updateAccountOwners(userId, account);
        return account;
      } else throw new Error("One of the accounts you entered does not exist");
    } else {
      const newAccount = {
        cash: validateNumberInput(account.cash),
        credit: validateNumberInput(account.credit),
        isActive: account.isActive !== "undefined" && true,
        accountId: uniqid(),
        ownersId: [userId],
      };
      addAccount(newAccount);
      return newAccount.accountId;
    }
  });
};

export const addUser = (firstName, lastName, accounts = []) => {
  if (!isValidName(firstName) && isValidName(lastName))
    throw new Error("name must contain only letters");
  if (!isValidAccountsStructure(accounts))
    throw new Error(
      "accounts should be an array containing account object or account ID"
    );

  const userId = uniqid.process();
  const userAccounts = createUserAccounts(userId, accounts);
  const users = getAllUsers();
  const user = {
    firstName,
    lastName,
    passportId: userId,
    totalCash: 0,
    accounts: userAccounts,
  };
  users.push(user);
  saveUsers(users);
  const updatedUser = updateUserCashBasedOnAccounts(userId);
  return updatedUser;
};

// update
export const updateUserCashBasedOnAccounts = (id) => {
  const users = getAllUsers();
  const userIndex = getUserIndexById(id);
  const accounts = getUserAccountsById(id);
  users[userIndex].totalCash = 0;
  accounts.forEach((account) => {
    if (account.isActive) {
      users[userIndex].totalCash += account.cash;
    }
  });
  saveUsers(users);
  return users[userIndex];
};

export const addAccountToUser = (id, accountId) => {
  const users = getAllUsers();
  const userIndex = getUserIndexById(id);
  users[userIndex].accounts.push(accountId);
  saveUsers(users);
};

export const removeAccountFromUser = (userId, accountId) => {
  const users = getAllUsers();
  const userIndex = getUserIndexById(userId);
  const accountIndex = users[userIndex].accounts.findIndex(
    (account) => account === +accountId
  );
  users[userIndex].accounts.splice(accountIndex, 1);
  saveUsers(users);
};

export const deleteUserById = (userId) => {
  const users = getAllUsers();
  const userIndex = getUserIndexById(userId);
  const user = users[userIndex];
  users.splice(userIndex, 1);
  saveUsers(users);
  return user;
};

export const removeAccountIdFromAllUsers = (accountId) => {
  const users = getAllUsers();
  const account = getAccountById(accountId);
  account.ownersId.forEach((ownerId) => {
    const userIndex = getUserIndexById(ownerId);
    const accountIndex = users[userIndex].accounts.findIndex(
      (account) => account === accountId
    );
    users[userIndex].accounts.splice(accountIndex, 1);
  });

  saveUsers(users);
};
