[Back to README](/README.md)

# MVP Goals

## Basic Game Logic

- [x] Fetch a four digit combination from the external API and store it in state
- [x] Validate user input to only allow for 4 numbers to be input
- [x] Allow for 10 guesses to be input
- [x] Store the user guesses and feedback in a guessHistory array
- [x] Compare user guess to answer combination
- [x] Calculate the number of correct numbers
- [x] Calculate the number of correct locations
- [x] Game concludes when there are no guesses left or the user guesses right

## Basic Server Setup

- [x] Create a Node/Express server for REST requests
- [x] Serve the React app and static files
- [x] Implement a route to fetch the random numbers

## Database Integration

- [x] Implement a MongoDB database
- [x] Store user data
- [x] Store game state

## UI/UX

- [x] Create a simple UI using React and the Material-UI component library
- [x] User should be able to input numbers easily
- [x] The user should be able to see the number of correct digits in the correct place
- [x] The user should be able to ese the number of correct digits in the incorrect place
- [x] The user should see a simple error message if no numbers matched
- [x] Users should see their guess and feedback addded to a guess history section
- [x] The user should be immediately able to see if they win or lose and what the answer was
- [x] The user should always be able to navigate home or back from whatever page they are on

## Testing

- [ ] Setup Jest, SuperTest, React Testing Library, and Cypress
- [x] Write basic tests for frontend and backend

## Documentation:

- [x] Write clear instructions for how to build and run the application
- [ ] Include instructions on how to play the game
- [x] Detail MVP, technical challenges, and stretch features
- [x] Create API and DB documentation
- [x] Include any diagrams
- [x] Write a “journal” for thought process, features implemented, and challenges encountered

## Security

- [x] Start with HTTP
- [x] Move to HTTPS when hosted

## Deployment:

- [x] Containerize the app using Docker
- [x] Host the game

## Overall:

- [x] Use TypeScript, Prettier and ESLint to get stricter type security and a better formatted codebase
- [x] Utilize a kanban board for project management and tasks
