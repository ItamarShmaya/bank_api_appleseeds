import fs from "fs";
import { getAccountById } from "../accounts/get_funcs.js";
import { USERS_PATH } from "../../data/data_dir_path.js";

export const getAllUsers = () => {
  try {
    const users = fs.readFileSync(USERS_PATH, "utf-8");
    return JSON.parse(users);
  } catch (e) {
    return [];
  }
};

export const getUserIndexById = (userId) => {
  const users = getAllUsers();
  return users.findIndex((user) => user.passportId === userId);
};

export const getUserById = (userId) => {
  const users = getAllUsers();
  return users.find((user) => user.passportId === userId);
};

export const getUserAccountsById = (userId) => {
  const user = getUserById(userId);
  return user.accounts.map((accountId) => getAccountById(accountId));
};

export const getUserByIdFull = (userId) => {
  const user = getUserById(userId);
  user.accounts = getUserAccountsById(userId);
  return user;
};
