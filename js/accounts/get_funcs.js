import fs from "fs";
import { ACCOUNTS_PATH } from "../../data/data_dir_path.js";
import { getAllUsers } from "../users/get_func.js";

export const getAllAccounts = () => {
  try {
    const accounts = fs.readFileSync(ACCOUNTS_PATH, "utf-8");
    return JSON.parse(accounts);
  } catch (e) {
    return [];
  }
};

export const getAccountIndexById = (userId) => {
  const accounts = getAllAccounts();
  return accounts.findIndex((account) => account.accountId === userId);
};

export const getAccountById = (accountId) => {
  const accounts = getAllAccounts();
  return accounts.find((account) => {
    return account.accountId === accountId;
  });
};
