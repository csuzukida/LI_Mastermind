[Back to README](/README.md)

# Lessons Learned

- [Project Setup and Ideation](#project-setup-and-ideation-day-1)
- [Challenges When Working on MVP](#challenges-when-working-on-mvp-day-1---2)
- [Testing & Troubles](#testing--troubles-day-3)
- [Thinking about Deployment](#thinking-about-deployment-day-4)
- [Tidying Up, Documentation, and Stretch Features](#tidying-up-documentation-and-stretch-features-day-5---7)

## Project Setup and Ideation (Day 1)

This was the initial phase which involved planning, determing the initial file structure, what my tech stack was going to be, and outlining what my [UI, DB, and API Design](/readme/design-api-reference.md) would be. After I had a basic layout and how I wanted to approach the design, I moved onto defining an [MVP](/readme/mvp.md) (minimum viable product) and [stretch features](/readme/stretch-features.md) that felt attainable within the confines of a one week sprint.

## Challenges When Working on MVP (Day 1 - 2)

When tackling the [MVP](/readme/mvp.md), I focused on getting the core game logic to work first. In order to do so, I focused on how to implement the ability to take an array of numbers (`guess`) and compare it to another array of numbers (`answer`) and have it return the number of correct digits as well as the number of correct digits in the correct place. My downfall here was slightly misunderstanding the requirements. I was initially returning the number of correct digits in the correct place and the number of correct digits that were NOT in the correct place. It was a slight enough difference that I did not catch this until much later in the development process and would ultimately have to revisit the logic again later.

By the end of the first day, I had a basic UI in React and the game logic working. Most of the rest of this day was spent getting Webpack and TypeScript working together.

## Testing & Troubles (Day 3)

At this point, the UI was more polished and I had achieved some of the [stretch features](/readme/stretch-features.md) I had defined such as integrating a `MongoDB` database and allowing the users to sign in and out. This also came with managing basic `sessions`. I was also able to implement `game settings` which allows the user to select a `variable difficulty` based off of the number of digits in the combination, the allowable digits (`0-9`) in the combination, the number of guesses, and a `timer`. Since the [MVP](/readme/mvp.md) was done, I decided to move onto basic testing where I encountered some project configuration difficulties.

My project configurations, while allowing a decently solid dev and prod environment, were very hard to configure and rigid. Just trying to add Jest for testing became a headache. At this point, I decided it was easier to simplify my configs to allow for better developer experience (for myself, but hey, good practice is good practice!).

This was actually how I caught the game logic error I previously mentioned, because I kept getting unexpected test results back. Luckily, I was able to go back and refactor the game logic by using two `frequency maps`, one for the `guess` array and one for the `answer` array. By doing so, I would be able to tally the frequency of digit appearances and do a comparison of the frequency values of each number. By selecting the `min` between the two maps, I would be able to add the correct number to the tally to get an accurate count.

## Thinking about Deployment (Day 4)

Now that the app was shaping up, it was time to think about how to distribute and present the app to make it useable without installation or having to worry about "`it works on my machine`" issues. There were two main areas I wanted to tackle now before heading into stretch feature territory: containerizing the app via `Docker` and deploying it. Luckily, I managed to find [fly.io](https://fly.io/), which had a really nice CLI and made deployment fairly straightforward. However, as I began the process of deployment, I realized there were some issues in my project setup that required some heavy reworking.

This mostly involved modifying the server be available on `'0.0.0.0'` instead of just '`localhost`' or '`127.0.0.1`'. I was also getting some mishandled promises when trying to start the server in the deployed environment, so I went back and refactored my logic to be more simple and add better error handling. Once I got that working, I immediately encountered a situation where the app was not able to connect to Mongo and it took a bit of time to realize it was because I had no whitelisted the app's IP for incoming requests.

Once that was all resolved, I had to tackle one last problem! My environment variables were not being set correctly inside of the deployment. I kept trying to set them over and over, but eventually it was resolved when I realized I should not be wrapping my values in quotes. So I manually cleared them out and set them one last time. Finally, the app was deployed and live!

## Tidying Up, Documentation and Stretch Features (Day 5 - 7)

Before proceeding on to stretch features, I decided to do a top-down walkthrough of each file to see if I could identify any glaring issues in terms of error handling, code style, or ambiguous code that needed commenting.

After that, I walked through each section of the app and tried to see if I could identify any `bugs`. I noticed a few, such as some missing error handling in the Login and Logout functionality that didn't catch some scenarios so the user ended up getting no feedback on the failure. If I had more time, I would love to make the `alerts` go away, because that is a _not so great_ experience for the user, but it will have to do for now as frontend was not my utmost concern for a backend take home assignment.

I was able to get around to a lot more of the stretch features than I had originally planned, which felt good. I didn't want to go overboard, so I left it at `managing sessions`, implementing `rate limiting` on `/api` routes, changing `game settings`, and implementing a `timer function`.

Last up my on list was writing `documentation` (like this README you're looking at now)! It took me about a day to compile all of my thoughts and create what I thought were readable, organized docs.

If I had more time, I'd love to setup a global leaderboard based on a points system. I know I could `aggregate` data directly via Mongo/Mongoose, but if I didn't go that route, I could still implement a simple function that GETS all users, iterate through the array and sort based on `totalPoints` and grab the first (or last) `n users` to display on the leaderboard to accomplish a similar thing.

I'd also really love to tackle caching using `redis` after I get the leaderboard to work. I would have the assumption that the global leaderboard would not change incredibly frequently, so caching the first call for the leaderboard would be a great way of reducing some load on the API.
