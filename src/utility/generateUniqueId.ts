import todosData from "../db/todos.json" assert { type: "json" };

/**
 * Generates a unique ID for a new Todo item based on the existing IDs.
 * @returns {number} A unique ID.
 */
export const generateUniqueId = (): number => {
  // Extract all existing IDs from the `todosData`
  const ids = todosData.todos.map((todo) => todo.id);

  // Initialize a starting ID
  let id = 1;

  // Increment the ID until it is unique and not included in the existing IDs
  while (ids.includes(id)) {
    id++;
  }

  // Return the generated unique ID
  return id;
};
