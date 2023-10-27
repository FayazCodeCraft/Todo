import express from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.js";

const router = express.Router();

router.route("/").post(createTodo).get(getTodos);
router.route("/:todoId").get(getTodo).put(updateTodo).delete(deleteTodo);

export default router;
