![Logo](/assets/mastermind_logo.png)​

# Table of Contents

- [Setup and Run locally](#run-locally)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Features](#features)
- [Feature Roadmap](#feature-roadmap)
- [Dev Roadmap](#dev-roadmap)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [API Reference](#api-reference)
- [Tech Stack](#tech-stack)
- [Lessons Learned](#lessons-learned)
- [FAQs](#faq)
- [Authors](#authors)
- [Acknowledgments](#acknowledgements)

## Setup and Run Locally

### Verify you have Node & NPM

This project relies on [Node.js](https://nodejs.org/en/), a server-side runtime environment for JavaScript, as well [npm](https://github.com/nvm-sh/nvm) (Node Package Manager) to install the required project dependencies. To confirm whether you have these installed on your local machine, run the following two commands in your terminal:

```bash
  $ node -v
  $ npm -v
```

The output of those commands should return version numbers. If they do not, visit these [instructions](https://github.com/nvm-sh/nvm#installing-and-updating) on how to install and use Node and npm using the [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) for Mac/Linux. If you are using Windows, check out these [instructions](https://github.com/coreybutler/nvm-windows#installation--upgrades) on how to install [nvm-windows](https://github.com/coreybutler/nvm-windows).

Be sure to follow the instructions to install and use nvm carefully and confirm that you have nvm installed by running:

```bash
  $ command -v nvm # for mac/linux
  $ nvm version # for windows
```

Once you have done that, you can install the latest version of node using nvm:

```bash
  $ nvm install node # for the latest version

      or

  $ nvm install --lts # for the "Long Term Support" version
```

or if using nvm-windows:

```bash
  $ nvm list available # list all available node versions

  $ nvm install [version] # choose which version you want
```

Now the `node -v` and `npm -v` commands should return version numbers. If not, please visit the relevant instruction page again and check out the troubleshooting section!

### Cloning and running the project

The following instructions assume you have [git](https://github.com/git-guides/install-git) installed. If not follow the link for instructions on how to install Git.

Clone this project (create a local copy of this repo on your machine) in the terminal by running:

```bash
  $ git clone https://github.com/csuzukida/LI_Mastermind.git
```

Navigate to the project directory:

```bash
  $ cd LI_Mastermind
```

Install the dependencies the project requires:
​

```bash
  $ npm install
```

Build the project:

```bash
  $ npm run build
```

Lastly, start the server and navigate to [http://localhost:8080](http://localhost:8080/) to play the game!
​

```bash
  $ npm start
```

## Environment Variables

To run this project locally with full features, you will need to add the following environment variables to a `.env` file:

```bash
  MONGO_URI='paste your MongoDB URI here'
  SESSION_SECRET='create your secret key here'
```

By entering a `MONGO_URI`, you will be able to connect to a MongoDB instance you provide either locally by installing [MongoDB](https://www.mongodb.com/docs/manual/installation/) or create a MongoDB instance in the cloud using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (this is free and does not require a credit card, but it does require creating an account with MongoDB).

If you just want to play the game but not create an account or store session data, feel free to skip this step!

## Running Tests

To run tests, run the following command:

```bash
  npm run test
```

You can find the tests contained in the `__tests__` directory in the root of the project.

## Features

- Create an account with email and password
- Sign in to enable sessions and sign out to destroy your session
- Change and save game settings
  - Change the number of digits in the combination
  - Change the number of guesses you have available
  - Enable timer mode
  - Change the amount of time you have
- View your previous guess history when playing a game
- See immediate feedback on your guess

## Feature Roadmap

- Adding a Sign in with `LinkedIn` option
- Allow users to delete their account
- Storing settings and game state so you can come back to a previous game with your settings saved even when you close the tab
- Toggle the guess history for more of a challenge
- Add friends and compete in a local and global leaderboard

## Dev Roadmap

- Implement file based logging using `Winston`
- Create more robust testing, including end-to-end testing using `Cypress` and `React Testing Library`
- `Dockerize` the application for a more consistent dev environment
- Setup a CI/CD pipeline with automated testing using `Github Actions`
- Implement caching for game state using Redis
- Deploy the application so users can simply click a link and play the game
- Implement a load balancer and auto-scaler
- Allows other devs to create their own visual wrapper around the core game logic via the API

## Demo

### Gameplay

![Gameplay](/assets/game_demo.gif)

### Settings

![Settings](/assets/settings_demo.gif)

## Screenshots

![Home Screenshot](/assets/home_screenshot.png)
![Game Screenshot](/assets/game_screenshot.png)
![Settings Screenshot](/assets/settings_screenshot.png)
![Signin Screenshot](/assets/signin_screenshot.png)

## API Reference

### Data

#### Get random numbers

```http
  GET /api/random-numbers?difficulty={difficulty}&min={min}&max={max}
```

| Parameter   | Type  | Description                                                            |
| :---------- | :---- | :--------------------------------------------------------------------- |
| `difficulty` | `int` | number of digits in combination (lowest is 3, max is 10, default is 4) |
| `min`       | `int` | lower threshold (inclusive) of digit generated (lowest is 0)           |
| `max`       | `int` | upper threshold (inclusive) of digit generated (highest is 9)          |

Example call:
```javascript
/api/random-numbers?difficulty=4&min=0&max=9
```

### Users

#### Get all users

```http
  GET /api/users/all-users
```

| Parameter | Type  | Description                                            |
| :-------- | :---- | :----------------------------------------------------- |
| `N/A`     | `N/A` | Fetches all users (requires admin level authorization) |

#### Get specific user

```http
  GET /api/users/:id
```

| Parameter | Type     | Description                                                                    |
| :-------- | :------- | :----------------------------------------------------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch (requires admin or user level authorization) |

#### Create user

```http
  POST /api/users/signup
```

**_JSON Request Body:_**
| Parameter | Type | Description |
| :--------- | :------- | :---------------------------------------- |
| `email` | `string` | Example: `"email": "example@example.com"` |
| `password` | `string` | Example: `"password": "examplePassword"` |

#### Login user

```http
  POST /api/users/login
```

**_JSON Request Body:_**
| Parameter | Type | Description |
| :--------- | :------- | :---------------------------------------- |
| `email` | `string` | Example: `"email": "example@example.com"` |
| `password` | `string` | Example: `"password": "examplePassword"` |

#### Logout user

```http
  POST /api/users/logout
```

| Parameter | Type  | Description                                                                   |
| :-------- | :---- | :---------------------------------------------------------------------------- |
| `N/A`     | `N/A` | Requires user to be logged in and have session cookie or will return an error |

#### Delete specific user

```http
  DELETE /api/users/:id
```

| Parameter | Type     | Description                                                       |
| :-------- | :------- | :---------------------------------------------------------------- |
| `id`      | `string` | **Required**. Id of user to delete (requires admin authorization) |

## Tech Stack

**Client:** React, React Hook Form, React Router, MUI
​

**Server:** Node, Express, MongoDB

## Lessons Learned

### Project Setup and Ideation (Day 1)

This was the initial phase which involved planning, determing the initial file structure, what my tech stack was going to be, and how I wanted to approach UI, database, and API design. After I had a basic layout and how I wanted to approach the design, I moved onto defining an MVP (minimum viable product) and stretch features that felt attainable within the confines of a one week sprint.

### Challenges When Working on MVP (Day 1 - 2)

When tackling the MVP, I focused on getting the core game logic to work first. In order to do so, I focused on how to implement the ability to take an array of numbers (guess) and compare it to another array of numbers (answer) and have it return the number of correct digits as well as the number of correct digits in the correct place. My downfall here was misunderstanding the algorithm requirements because I was initially returning the number of correct digits in the correct place and the number of "almost correct" digits that NOT in the correct place. It was a slight enough difference that I did not catch this until much later in the development process and would ultimately have to revisit the logic again later.

By the end of the first day, I had a basic UI in React and the game logic working (or so I thought). Most of this day was spent getting Webpack and TypeScript working together.

### Testing & Troubles (Day 3)

At this point, the UI was more polished and I had achieved some of the stretch features I had defined such as integrating a MongoDB database and allowing the users to sign in and out. This also came with managing basic sessions. I was also able to implement game settings which allows the user to select a variable difficulty based off of the number of digits in the combination, the allowable digits (0-9) in the combination, the number of guesses, and a timer.

Since the MVP was done, I decided to move onto basic testing. This is where I ran into a slew of problems...

My project configurations, while allowing a solid dev and prod environment, were very hard to configure and rigid. Just trying to add Jest for testing became a half-day headache. At this point, I decided it was easier to simplify my configs to allow for better developer experience (for myself, but hey, good practice is good practice!). Managing that, I was able to get Jest to work. I also had to test all the functionality of my app manually once more to make sure I hadn't broken anything along the way.

I actually caught the game logic error I previously mentioned when I setup my Jest tests, because I was getting the unexpected results back. I was able to go back and refactor the game logic by using two frequency maps, one for the guess array and answer array and do a comparison of the frequency values of each number.

<!-- ### Thinking about Deployment (Day 4)

Now that the app was shaping up, it was time to think about deploying the app to make it useable without installation or having to worry about the "it works on my machine" type issues. There were two main areas I wanted to tackle now before heading into stretch feature territory: containerizing the app via Docker and deploying on a free hosting service ([fly.io](https://fly.io/)). -->

## FAQ

#### Can I edit my email or delete my account?

- Currently, changing a registered email or deleting an account is not supported, but will be soon!

#### Can I play without creating an account?

- Absolutely! You can play the game and change settings without having to create an account.

## Authors

***Chris Suzukida***  
Github [@csuzukida](https://www.github.com/csuzukida)  
LinkedIn [@chris-suzukida](https://www.linkedin.com/in/chris-suzukida/)

## Acknowledgements

- Special thanks to the LinkedIn REACH program for this opportunity
- Extra special thank you to my interviewers who will be reviewing this project, you are all rockstars!
- README template from [readme.so](https://readme.so/)
- Number input component adapted from Ahmed Hamed's `React Verification Code Input` from this [codesandbox.io](https://codesandbox.io/s/react-verification-code-input-kvthq)
