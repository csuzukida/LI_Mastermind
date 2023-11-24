![Logo](/assets/mastermind_logo.png)​

# Table of Contents

- [Play on the Web](#play-on-the-web-🌎)
- [Setup and Run locally](#setup-and-run-locally)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests-🧪)
- [API Reference](#api-reference-📓)
- [Features](#features-🏁)
- [Feature Roadmap](#feature-roadmap-🔜)
- [Dev Roadmap](#dev-roadmap-🔜)
- [Demo](#demo)
- [Screenshots](#screenshots)
- **[Lessons Learned](#lessons-learned)** ⬅️⬅️⬅️⬅️ **_Check me out_**!
- [FAQs](#faq)
- [Authors](#authors)
- [Acknowledgments](#acknowledgements)

## Play on the Web 🌎

🚀🚀 **Visit** [https://li-mastermind.fly.dev](https://li-mastermind.fly.dev) **to see a deployed version of this app!** 🚀🚀

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

Lastly, start the server and navigate to [http://localhost:3000](http://localhost:3000/) to play the game!
​

```bash
  $ npm start
```

## Environment Variables

To run this project locally, you will need to add the following environment variables to a `.env` file:

```bash
  #replace with your string, but do not wrap in quotes!
  MONGO_URI=mongodb:// or mongodb+srv://

  #create a secret key
  SESSION_SECRET=your-secret-key
```

By entering a `MONGO_URI`, you will be able to connect to a MongoDB instance you provide either locally by installing [MongoDB](https://www.mongodb.com/docs/manual/installation/) or creating a MongoDB instance in the cloud using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (this is free and does not require a credit card, but it does require creating an account with MongoDB). Once you have a connection string, paste that into your `.env` file, but do not wrap the values in quotes!

For the `SESSION_SECRET`, you can set this value to whatever you would like since you are only running this locally, such as `this-is-a-session-secret`, however you can choose to use any long, randomly generated string.

## Running Tests 🧪

To run tests, run the following command:

```bash
  npm run test
```

You can find the tests contained in the `__tests__` directory in the root of the project.

## API Reference 📓

**Checkout the [API & Design README](/readme/design-api-reference.md) for more info on:**

- UI Mockup
- Database Schema Design
- API reference

## Features 🏁

- Create an account with email and password
- Sign in to enable sessions and sign out to destroy your session
- Change your password and/or delete your account
- Change and save game settings
  - Change the number of digits in the combinatio (3-10)
  - Change the range of numbers for each digit (0-9)
  - Change the number of guesses you have available (up to 20)
  - Enable timer mode
  - Change the amount of time you have
- See immediate feedback on your guess
- View your previous guess history

## Feature Roadmap 🔜

- [] Storing settings and game state so you can come back to a previous game with your settings saved even when you close the tab
- [] Toggle the guess history for more of a challenge
- [] Add friends and compete in a local and global leaderboard
- [] Adding a Sign in with `LinkedIn` option

## Dev Roadmap 🔜

- [] Implement file based logging
- [] Create more robust testing, including end-to-end testing using `Cypress` and `React Testing Library`
- [] Setup a CI/CD pipeline with automated testing using `Github Actions`
- [] Implement caching for game state and leaderboard using Redis
- [] Allows other devs to create their own visual wrapper around the core game logic via the API

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

## Lessons Learned

### 📚 Interested in my week long journey? 📚

**_Click [here](/readme/lessons-learned.md) to read more about my journey, the technical challenges I encountered, and how I overcame them!_**

### 🔬 Interested in the scope and stretch features? 🔬

**_Click [here](/readme/mvp.md) for the MVP goals and [here](/readme/stretch-features.md) for a list of the stretch features I had defined!_**

## FAQ

#### Can I edit my email or delete my account?

- Currently, changing a registered email or deleting an account is not supported, but will be soon!

#### Can I play without creating an account?

- Absolutely! You can play the game and change settings without having to create an account.

## Authors

**_Chris Suzukida_**  
Github [@csuzukida](https://www.github.com/csuzukida)  
LinkedIn [@chris-suzukida](https://www.linkedin.com/in/chris-suzukida/)

## Acknowledgements

```
A very special thanks to the LinkedIn REACH program for this opportunity!

Extra special THANK_YOU to the INTERVIEWERS and anybody else who will be reviewing this project, you are all ROCKSTARS! ⭐️✨

- README template from https://readme.so/

- Number input component adapted from Ahmed Hamed's 'React Verification Code Input' from https://codesandbox.io/s/react-verification-code-input-kvthq
```
