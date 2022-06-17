# Bank API

## Usage

### Base URL

**https://is-bank-api.herokuapp.com/**

##### get all users

**/users**

```
[
  {
    "firstName": "string",
    "lastName": "string",
    "accounts": ["string"]
  }
]
```

##### get users by search

**/users?filter={}&min={}&max={}&firstName={}&lastName={}**
filter **required** => cash / firstname / lastname
min => if specified set minimum cash
max => if specified set maximum cash
fistName => for firstName
lastName => for lastName

##### get user by id

**/user/{id}**

```
  {
    "firstName": "string",
    "lastName": "string",
    "accounts": ["string"]
  }
```

##### get user by id full

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
