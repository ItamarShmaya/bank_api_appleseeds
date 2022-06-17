# Bank API

## Usage

### Base URL

**https://is-bank-api.herokuapp.com/**

# METHODS

- [GET](#get)
- [PUT](#put)
- [POST](#post)
- [DELETE](#delete)

---

### GET

#### get all users

**/users**

Returns:

```
[
  {
    "firstName": "string",
    "lastName": "string",
    "accounts": ["string"]
  }
]
```

#### get users by search

**/users?filter={}&min={}&max={}&firstName={}&lastName={}**

filter **required** => cash / firstname / lastname

min => if specified set minimum cash

max => if specified set maximum cash

firstName => for firstName

lastName => for lastName

Returns:

```
[
  {
    "firstName": "string",
    "lastName": "string",
    "accounts": ["string"]
  }
]
```

#### get all accounts

**/accounts**

Returns:

```
[
  {
    "cash": numebr,
    "credit": number,
    "isActive": boolean,
    "accountId": "string",
    "ownersId": ["string"]
  }
]
```

#### get user by id

**/user/{id}**

```
  {
    "firstName": "string",
    "lastName": "string",
    "accounts": ["string"]
  }
```

#### get user by id full

**/user/{id}**

```
  {
    "firstName": "string",
    "lastName": "string",
    "accounts": [
      {
        "cash": number,
        "credit": number,
        "isActive": boolean,
        "accountId": "string",
        "ownersId": ["string"]
      }
    ]
  }
```

### PUT

#### withdraw by user id

**/user/{id}/withdraw**

**_required_**

```
req.body: {
  "accountId": "string",
  "amount": number
}
```

#### deposite by user id

**/user/{id}/deposite**

**_required_**

```
req.body: {
  "accountId": "string",
  "amount": number
}
```

#### change credit by user id

**/user/{id}/credit**

**_required_**

```
req.body: {
  "accountId": "string",
  "amount": number
}
```

#### transfer by user id

**/user{id}/transfer**

**_required_**

```
req.body: {
  "fromAccountId": "string",
  "amount": number,
  "toUserId" "string",
  "toAccountId": "string"
}
```

#### add existing account to user

**/user/{id}/add-account**

**_required_**

```
req.body: {
  "accountId": "string",
}
```

#### remove account from user

**/user/{id}/remove-account**

**_required_**

```
req.body: {
  "accountId": "string",
}
```

### POST

#### create user

**/users**

**_required_**

```
req.body: {
  "firstName": "string",
  "lastName": "string",
  "accounts": []
}
```

\*accounts => an array.

empty/existing account id / new account object.

example:

```
"accounts": []
-----------------------
"accounts": [
  "azxcas2e32",
  "zxczsadzxc",
]
-----------------------
"accounts": [
  {
    "cash": numner,
    "credit": number,
    "isActive": boolean
  }
]
-----------------------
"accounts": [
  "azxcas2e32",
    {
    "cash": numner,
    "credit": number,
    "isActive": boolean
  }
]
```

### DELETE

#### delete user

**/users/{id}**

#### delete account

**/account/{id}**
