[Back to README](/README.md)

# Design

- [UI Design](#ui-design)
- [Database Design](#database-design)
- [API Reference](#api-design)

## UI Design

![ui-design](/assets/ui_design.png)

## Database Design

### User Schema

| `Key`        | `Type` | `Required` | `Default`  | `Unique` | `Notes`                     |
| :----------- | :----- | :--------- | :--------- | :------- | :-------------------------- |
| `email`      | String | true       | no         | true     |
| `password`   | String | true       | no         | false    |
| `role`       | String | false      | `'user'`   | false    | `Enum: ['user'`, `'admin']` |
| `created_at` | Date   | false      | `Date.now` | false    |

### Game Schema

| `Key`        | `Type`   | `Required` | `Default`  | `Unique` | `Notes`                 |
| :----------- | :------- | :--------- | :--------- | :------- | :---------------------- |
| `user`       | ObjectId | true       | no         | false    | `ref: 'User'`           |
| `startTime`  | Date     | true       | `Date.now` | false    |                         |
| `endTime`    | Date     | false      | no         | false    |                         |
| `score`      | Number   | false      | 0          | false    |                         |
| `moves`      | [String] | false      | no         | no       |                         |
| `gameResult` | String   | false      | no         | no       | `Enum: ['win', 'loss']` |

### Game Settings Schema

| `Key`             | `Type`   | `Required` | `Default` | `Unique` | `Notes`       |
| :---------------- | :------- | :--------- | :-------- | :------- | :------------ |
| `user`            | ObjectId | true       | no        | false    | `ref: 'User'` |
| `difficultyLevel` | Number   | false      | `4`       | false    |               |
| `minValue`        | Number   | false      | `0`       | false    |               |
| `maxValue`        | Number   | false      | `7`       | false    |               |
| `timerSetting`    | Number   | false      | `30000`   | false    |               |
| `showTimer`       | Boolean  | false      | `false`   | false    |               |
| `maxGuesses`      | Number   | false      | `10`      | no       |               |

## API Design

### Data 💾

#### Get random numbers

```http
  GET /api/random-numbers?length={length}&min={min}&max={max}
```

| URL Parameter | Type  | Description                               | Returns                                                                                |
| :------------ | :---- | :---------------------------------------- | -------------------------------------------------------------------------------------- |
| `length`      | `int` | number of digits in combination           | ValidationError: `res.status(400).json({ message: 'Min cannot be greater than max' })` |
| `min`         | `int` | lower threshold (inclusive), lowest is 0  | Success: `res.status(200).json(randomNumbersArray)` as `Array<number>`                 |
| `max`         | `int` | upper threshold (inclusive), highest is 9 |                                                                                        |

Example call:

```javascript
/api/random-numbers?difficulty=4&min=0&max=9
```

### Users 👥

#### Get all users

```http
  GET /api/users/all-users
```

| Parameter | Type  | Description                                            | Returns                                             |
| :-------- | :---- | :----------------------------------------------------- | --------------------------------------------------- |
| `N/A`     | `N/A` | Fetches all users (requires admin level authorization) | `res.status(200).json(users)` as `Array<MongoUser>` |

#### Get specific user

```http
  GET /api/users/:id
```

| URL Parameter | Type       | Description                          | Returns                                                                         |
| :------------ | :--------- | :----------------------------------- | ------------------------------------------------------------------------------- |
| `id`          | `ObjectId` | **Required**. Id of user to fetch    | Failure: `res.status(400).json({ message: 'Missing id or malformed request' })` |
|               |            | (requires admin level authorization) | Success: `res.status(200).json(user)` as `Object<UserSchema>`                   |

#### Create user

```http
  POST /api/users/signup
```

| JSON Key   | Type     | Description      | Returns                                                                                  |
| :--------- | :------- | :--------------- | ---------------------------------------------------------------------------------------- |
| `email`    | `String` | email of user    | Validation error: `res.status(400).json({ message: 'Email and password are required' })` |
| `password` | `String` | password of user | Email not found: `res.status(400).json({ message: 'Invalid email or password' })`        |
|            |          |                  | Success: `res.status(200).json({ isValidPassword: true })`                               |

#### Login user

```http
  POST /api/users/login
```

| JSON Key   | Type     | Description      | Returns                                                                                  |
| :--------- | :------- | :--------------- | ---------------------------------------------------------------------------------------- |
| `email`    | `String` | email of user    | Validation error: `res.status(400).json({ message: 'Email and password are required' })` |
| `password` | `String` | password of user | Error: `res.status(401).json({ message: 'login unsuccessful' })`                         |
|            |          |                  | Success: `res.status(200).json({ message: 'login successful' })`                         |

#### Logout user

```http
  POST /api/users/logout
```

| Parameter | Type  | Description                              | Returns                                                           |
| :-------- | :---- | :--------------------------------------- | ----------------------------------------------------------------- |
| `N/A`     | `N/A` | Requires session or will return an error | Failure: `res.status(500).json({ message: 'Could not log out' })` |
|           |       |                                          | Success: `res.status(200).json({ message: 'logout successful' })` |

#### Delete specific user

```http
  DELETE /api/users/:id
```

| Parameter | Type       | Description                                                       | Returns                                            |
| :-------- | :--------- | :---------------------------------------------------------------- | -------------------------------------------------- |
| `id`      | `ObjectId` | **Required**. Id of user to delete (requires admin authorization) | status `204` on success or `400` on failed request |

#### Verify password

```http
  POST /api/users/verify-password
```

| JSON Key   | Type     | Description                  | Returns                                                                    |
| :--------- | :------- | :--------------------------- | -------------------------------------------------------------------------- |
| `email`    | `String` | `{ email: UserEmail }`       | `{ isValidPassword: Boolean }` and status `200` or status `400` on failure |
| `password` | `String` | `{ password: UserPassword }` |

#### Change password

```http
  POST /api/users/change-password
```

| JSON Key   | Type     | Description               | Returns                                                 |
| :--------- | :------- | :------------------------ | ------------------------------------------------------- |
| `password` | `String` | Checks user session first | Success: status code `200` `{ password: UserPassword }` |
|            |          |                           | Failed: status code `400`                               |

#### Info on own account

```http
  GET /api/users/me
```

| Parameter | Type  | Description                   | Returns                |
| :-------- | :---- | :---------------------------- | ---------------------- |
| `N/A`     | `N/A` | Checks for user session first | `{ email: UserEmail }` |

### Auth 🔐

#### Check session

```http
  GET /api/auth/check-session
```

| Parameter | Type  | Description             | Returns                                                               |
| :-------- | :---- | :---------------------- | :-------------------------------------------------------------------- |
| `N/A`     | `N/A` | Checks for session data | `{ sessionActive: boolean, message: 'Session active (or inactive)' }` |
