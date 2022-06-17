import { getAllUsers } from "./get_func.js";

export const filterUsersByCash = (min, max) => {
  if (min && max) return filterUsersByRangeCashAmount(min, max);
  if (min) return filterUsersByMinCashAmount(min);
  if (max) return filterUsersByMaxCashAmount(max);
  else return getAllUsers();
};

export const filterUsersByMinCashAmount = (min) => {
  const users = getAllUsers();
  return users.filter((user) => user.totalCash >= min);
};

export const filterUsersByMaxCashAmount = (max) => {
  const users = getAllUsers();
  return users.filter((user) => user.totalCash <= max);
};

export const filterUsersByRangeCashAmount = (min, max) => {
  const users = getAllUsers();
  return users.filter((user) => user.totalCash >= min && user.totalCash <= max);
};

export const filterUsersByName = (nameKey, name) => {
  if (name) {
    const users = getAllUsers();
    return users.filter((user) =>
      user[nameKey].toLowerCase().includes(name.toLowerCase())
    );
  } else {
    return getAllUsers();
  }
};
