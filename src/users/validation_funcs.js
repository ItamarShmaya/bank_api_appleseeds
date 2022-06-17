import validator from "validator";
import { getUserById } from "./get_func.js";

export const isValidName = (name) => {
  return validator.isAlpha(name);
};
export const isValidAccountsStructure = (accounts) => {
  if (!Array.isArray(accounts)) return false;
  if (accounts.length === 0) return true;
  if (
    accounts.every(
      (account) => isPlainObject(account) || typeof account === "string"
    )
  )
    return true;
};

export const doesUserExist = (id) => {
  const user = getUserById(id);
  return user ? true : false;
};

export const doesUserOwnAccount = (userId, accountId) => {
  const user = getUserById(userId);
  return user.accounts.some((account) => account === +accountId);
};

const isPlainObject = (o) => {
  const c =
    Object.prototype.toString.call(o) == "[object Object]" &&
    o.constructor &&
    o.constructor.name == "Object";
  return c === true;
};

// export const isValidUserInfo = () => {

// }
