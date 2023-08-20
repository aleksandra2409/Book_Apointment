import mongoose from "mongoose";
import { Todo, TodoStatus } from "../types";

const todoSchema = new mongoose.Schema<Todo>({
    title: String,
    status: {type: String, enum: Object.values(TodoStatus)},
    priority: {type: Number, from: 0, to: 5},
});

const TodoModel = mongoose.model("Todo", todoSchema);

export default TodoModel;