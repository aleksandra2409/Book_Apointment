# To Do App

## Introduction

Welcome to your application! This repository contains both the server and client applications. The server is responsible for handling API requests and data storage, while the client is the user-facing interface.

## Prerequisites

Before running the application, make sure you have the following installed on your machine:

- Node.js and npm (https://nodejs.org)
- MongoDB (https://www.mongodb.com)

## Server Setup

1. Open a terminal and navigate to the `server` directory: `cd server`.
2. Install the server dependencies: `npm install`.

Start the server: npm run dev.
The server should be running on http://localhost:5050.

## Client Setup

1. Open a new terminal window/tab and navigate to the `client` directory: `cd client`.
2. Install the client dependencies: `npm install`.
3. Start the client: npm run dev.
4. The client should be running on http://127.0.0.1:5173/

## Frontend Details
The client folder contains the frontend code, which uses React with Vite as the build tool. Here are some important details:

- The client uses the Vite development server for fast and optimized development builds.
- The main entry point for the client is src/main.js.
- React components can be found in the src/components directory.
- Additional dependencies can be installed using npm 

## API Structure
The server exposes the following API routes for todos:

- GET /api/todos: Get all todos.
- POST /api/todos: Create a new todo.
- PUT /api/todos/:id: Update a todo by ID.
- DELETE /api/todos/:id: Delete a todo by ID.

## Login Route
The server also provides a login route:

- POST /api/login: Authenticate user credentials and return an access token.
- user: admin, password: password
