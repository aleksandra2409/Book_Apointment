import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./util/secrets";
import TodoModel from "./models/Todo";

import isLoggedIn from "./middleware/auth";

const router = express.Router();

// TODO: move "routes" to separate routes folder and import them here
router.post("/api/login", async (req: Request, res: Response) => {
  const { user, password } = req.body;
  // Move user data to database
  if (user === "admin" && password === "password") {
    const token = jwt.sign({ password }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({
      token,
    });
  } else {
    res.status(401).json({
      message: "Invalid password",
    });
  }
});

router.get("/api/todo", isLoggedIn, async (req: Request, res: Response) => {
  const todos = await TodoModel.find();
  res.json(todos);
});

router.post("/api/todo", isLoggedIn, async (req: Request, res: Response) => {
  const body = req.body;

  const newTodo = new TodoModel({
    title: body.title,
    status: body.status,
    priority: body.priority,
  });
  const createdTodo = await newTodo.save();
  res.json(createdTodo);
});

router.put("/api/todo", isLoggedIn, async (req: Request, res: Response) => {
  const body = req.body;
  const todoId = req.query.todoId;

  await TodoModel.findByIdAndUpdate(todoId, {
    title: body.title,
    status: body.status,
    priority: body.priority,
  });
  res.json({
    message: "Todo updated",
  });
});

router.delete("/api/todo", isLoggedIn, async (req: Request, res: Response) => {
  const todoId = req.query.todoId;

  await TodoModel.findByIdAndDelete(todoId);
  res.json({
    message: "Todo deleted",
  });
});

export default router;
