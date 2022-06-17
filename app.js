import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserByIdFull,
} from "./js/users/get_func.js";
import {
  doesUserExist,
  doesUserOwnAccount,
} from "./js/users/validation_funcs.js";
import {
  addAccountToUser,
  addUser,
  deleteUserById,
  removeAccountFromUser,
  removeAccountIdFromAllUsers,
  updateUserCashBasedOnAccounts,
} from "./js/users/update_funcs.js";
import { getAccountById } from "./js/accounts/get_funcs.js";
import {
  TRANSACTIONS,
  checkUserAndAccount,
  isValidTransaction,
  doesAccountExist,
  doesAccountHaveCashOrInDebt,
} from "./js/accounts/validation_funcs.js";
import {
  depositeCash,
  withdrawCash,
  updateCredit,
  deleteAccountById,
  removeUserIdFromAccount,
} from "./js/accounts/update_funcs.js";
import {
  filterUsersByCash,
  filterUsersByName,
} from "./js/users/filter_funcs.js";

const PORT = process.env.PORT || 5050;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// get
app.get("/users", (req, res, next) => {
  if (Object.keys(req.query).length !== 0) next();
  else {
    const users = getAllUsers();
    res.send(users);
  }
});

app.get("/users", (req, res) => {
  const { filter, min, max, name } = req.query;
  if (filter === "cash") return res.send(filterUsersByCash(min, max));
  if (filter === "name") return res.send(filterUsersByName(name));
});

app.get("/user", (req, res) => {
  res.send("Need to add id \n Example: 'http://www.localhost:5050/user/{:id}'");
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  if (user) {
    res.send(user);
  } else {
    res.status(418);
    res.send("User not found");
  }
});

app.get("/user/:id/full", (req, res) => {
  const { id } = req.params;
  const user = getUserByIdFull(id);
  if (user) res.send(user);
  else {
    res.status(418);
    res.send("User doesn't exist");
  }
});

// put

app.put("/user/:id/withdraw", (req, res) => {
  const { id } = req.params;
  const { accountId, amount } = req.body;
  try {
    checkUserAndAccount(id, accountId);
    isValidTransaction(accountId, amount, TRANSACTIONS.WITHDRAW);
    const account = withdrawCash(accountId, amount);
    updateUserCashBasedOnAccounts(id);
    res.send(account);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});
app.put("/user/:id/deposite", (req, res) => {
  const { id } = req.params;
  const { accountId, amount } = req.body;
  try {
    checkUserAndAccount(id, accountId);
    isValidTransaction(accountId, amount, TRANSACTIONS.DEPOSITE);
    const account = depositeCash(accountId, amount);
    updateUserCashBasedOnAccounts(id);
    res.send(account);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});
app.put("/user/:id/credit", (req, res) => {
  const { id } = req.params;
  const { accountId, amount } = req.body;
  try {
    checkUserAndAccount(id, accountId);
    isValidTransaction(accountId, amount, TRANSACTIONS.CREDIT);
    const account = updateCredit(accountId, amount);
    res.send(account);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});

app.put("/user/:id/transfer", (req, res) => {
  const { id } = req.params;
  const { fromAccountId, amount, toUserId, toAccountId } = req.body;
  try {
    checkUserAndAccount(id, fromAccountId);
    checkUserAndAccount(toUserId, toAccountId);
    isValidTransaction(fromAccountId, amount, TRANSACTIONS.TRANSFER);
    withdrawCash(fromAccountId, amount);
    depositeCash(toAccountId, amount);
    const account = getAccountById(fromAccountId);
    updateUserCashBasedOnAccounts(id);
    updateUserCashBasedOnAccounts(toUserId);
    res.send(account);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});

app.put("/user/:id/add-account", (req, res) => {
  const { id } = req.params;
  const { accountId } = req.body;
  try {
    if (!doesUserExist(id)) throw new Error("User doesn't exist");
    if (!doesAccountExist(accountId)) throw new Error("Account doesn't exist");
    if (doesUserOwnAccount(id, accountId))
      throw new Error("User already owns this account");
    addAccountToUser(id, accountId);
    updateUserCashBasedOnAccounts(id);
    res.send(getUserById(id));
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});
app.put("/user/:id/remove-account", (req, res) => {
  const { id } = req.params;
  const { accountId } = req.body;
  try {
    if (!doesUserExist(id)) throw new Error("User doesn't exist");
    if (!doesAccountExist(accountId)) throw new Error("Account doesn't exist");
    if (!doesUserOwnAccount(id, accountId))
      throw new Error("User doesn't own this account");
    removeAccountFromUser(id, accountId);
    updateUserCashBasedOnAccounts(id);
    res.send(getUserById(id));
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});
// post

app.post("/users", (req, res) => {
  const { firstName, lastName, accounts } = req.body;
  try {
    const user = addUser(firstName, lastName, accounts);
    updateUserCashBasedOnAccounts(user.passportId);
    res.send(user);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});

// delete

app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  try {
    if (!doesUserExist(id)) throw new Error("User doesn't exist");
    const user = getUserById(id);
    user.accounts.forEach((accountId) => {
      removeUserIdFromAccount(id, accountId);
    });
    deleteUserById(id);
    res.send(user);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});

app.delete("/account/:id", (req, res) => {
  const { id } = req.params;
  try {
    if (!doesAccountExist(id)) throw new Error("Account doesn't exist");
    if (doesAccountHaveCashOrInDebt(id))
      throw new Error("Can't delete an account with cash or in debt");
    removeAccountIdFromAllUsers(id);
    const deletedAccount = deleteAccountById(id);
    res.send(deletedAccount);
  } catch (e) {
    res.status(418);
    res.send(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is up at port ${PORT}`);
});
