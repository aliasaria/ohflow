# OhFlow

![Screenshot](/docs/img/screenshot.png)

OhFlow is a lowcode GUI to create workflows that can process objects. OhFlow heavily uses the [React Flow](https://reactflow.dev/) Library to render the GUI.

For information on the concepts behind the application, read the [Overview](OVERVIEW.md)

# Quick Start:

To get started run the following:

`node ./server/app.js`

To start the webserver.

Then, in a separate window run:

`npm start`

To start the GUI and then you can visit `http://localhost:3000` to use the app.

# Available Scripts

In the project directory, you can run:

## Webserver:

### `node ./server/app.js`

Starts the webserver and database

## React Frontend:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

# Architecture

OhFlow is designed as a React frontend that talks to a very simple Express.JS backend

```mermaid
graph TD
    A["React Frontend /src"] --> B["Express.JS Backend /server"]
    B --> |sequelize| C("SQL Database")
```

The database uses the sequelize database abstraction in Node.JS so you can point it
at most common databases including MySQL or Postgres. Out of the box it points to
a SQLite Database stored in the `/db` directory
