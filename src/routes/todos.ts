import express from "express";
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
} from "../controllers/todo.js";

const router = express.Router();

router.route("/").post(createTodo).get(getTodos);
router.route("/:todoId").get(getTodo).put(updateTodo);

export default router;
