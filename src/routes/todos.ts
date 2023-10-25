import express from "express";
import { createTodo, getTodos } from "../controllers/todo.js";

const router = express.Router();

router.route("/").post(createTodo).get(getTodos);

export default router;
