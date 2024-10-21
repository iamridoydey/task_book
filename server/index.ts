import { Request, Response } from "express";
import { Error } from "mongoose";
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/todo_app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err: Error) => console.log("Mongo Error", err));

// Define Todo schema with timestamps
const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create Todo model
const Todo = mongoose.model("Todo", todoSchema);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// GET all todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    return res.status(200).json(todos);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching todos" });
  }
});

// POST a new todo
app.post("/todos", async (req: Request, res: Response) => {
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).json({ error: "Please provide the 'todo' field" });
  }

  try {
    const newTodo = new Todo({ todo });
    const savedTodo = await newTodo.save();
    return res.status(200).json(savedTodo);
  } catch (err) {
    return res.status(500).json({ error: "Error adding todo" });
  }
});

// HTTP request on the same path (/:id)
app
  .route("/todos/:id")
  .get(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(404).json({ error: "Todo Not Found" });
      }

      return res.status(200).json(todo);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching todo" });
    }
  })
  .patch(async (req: Request, res: Response) => {
    const { id } = req.params;
    const newTodo = req.body;
    if (!newTodo || !newTodo.todo) {
      return res
        .status(400)
        .json({ message: "Please provide valid todo data" });
    }

    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { $set: newTodo },
        { new: true, runValidators: true }
      );
      if (!updatedTodo) {
        return res.status(404).json({ message: "Task Not Found!" });
      }

      return res.status(200).json("Successfully Updated The Task.");
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  })
  .delete(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await Todo.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Task Not Found!" });
      }

      return res.status(200).json("Successfully Deleted The Task.");
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
