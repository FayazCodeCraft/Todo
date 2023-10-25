/**
 * Represents the structure of a Todo.
 */
export interface TodoInterface {
  /**
   * Unique identifier for the Todo.
   */
  id: number;
  /**
   * The title of the Todo.
   */
  title: string;
  /**
   * A description of the Todo.
   */
  description: string;
  /**
   *  The due date of the Todo.
   */
  dueDate: string;
  /**
   * To check whether task completed or not
   */
  completed: boolean;
}
