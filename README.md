# Crafting Tracker v0.1.0
The crafting tracker is meant to be a locally ran website to help keep track of crafting recipes for video games. 

## How to set it up
The first thing you need to do is install all dependencies for the website by running the following while in the project's root directory:
```bash
npm install
```

Then you must set up the local database using Drizzle. The database is ran locally using SQLite and it should create a file called `crafting-tracker.db`
in the root directory of the project. To create this database run the following command in the project's root directory:
```bash
npx drizzle-kit push
```

Ensure the file `crafting-tracker.db` was created successfully before continuing. 

Next, run the website using the following commands and follow the website to the given URL (the standard is http://localhost:3000): 
```bash
npm run build
npm run start
```

The website should be mostly accessible for desktop and mobile users, so it can be set up on a home server and can be accessed from any device on the network.

> Please Note: This project is not made for a production environment. The build is solely meant to run on local computers and to be used as a utility tool for the individual that is running it. Anyone that has access to the site has access to essentially the entire database as well. I would recommend keeping the project's scope to a local network at most. 

## How to use
The site is broken up into 3 main components: `Tasks`, `Items`, and `Materials`.

`Tasks` are the large goals set by the player. Tasks contain a list of items that the user has a goal of creating in the future. 

`Items` are the next step down from `Tasks`. Along with each `Item`, there is a set of `Recipes` that go along with the `Item`. The `Recipe` denotes the `Material`, `Goal Quantity`, and `Quantity Owned` by the user. `Recipes` are what tracks the user's progress towards completion. 

> Note: An `Item` can only belong to a single task and be tracked for a single task. If you wish to have the same `Item` in more than one `Task`, you must create a duplicate of the `Item` and proceed to update both.  

`Materials` are the base building block of `Recipes` and `Items`. A single `Material` can be tied to multiple `Recipes` with different quantities for each. `Materials` are supposed to be the generic items used to make the final product. 

To begin making a `Task`, you must first figure out what `Items` will be in the task, and then decide what `Materials` will be in each `Item`. Start by creating new `Materials` representing the crafting ingredients for each `Item`, then create each `Item` and set the quantity of each `Material`. Finally, create your `Task` with the `Items` that you wish. 

If you make a mistake or a change is needed to be made, `Items` can be deleted from `Tasks`, `Materials` can be deleted from `Items`, `Material` quantity can be changed for each `Item` individually, new `Items` can be added to `Tasks`, and new `Materials` can be added to each `Item`. 

## What it runs on
This utility site primarily consists of `Next.JS` using `TypeScript` and `TailwindCSS` to create the sites. 

Data persistance is done using `Drizzle ORM` accessing a `SQLite` database that is created locally before running the project. 

The site uses some components from `ShadCN` component library and `Lucide` icons. 