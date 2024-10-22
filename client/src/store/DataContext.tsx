import { createContext, ReactNode, useEffect, useReducer } from "react";
import Todo from "../components/Todo"; // Make sure Todo has _id: string

interface Action {
  type: string;
  payload?: any;
}

interface contextType {
  todos: Todo[];
  addItem: (todoName: string) => void;
  deleteItem: (id: string) => void;
  updateItem: (todo: Todo) => void;
}

// Create the context with default values for state and dispatch
export const DataContext = createContext<contextType>({
  todos: [],
  addItem: () => {},
  deleteItem: () => {},
  updateItem: () => {},
});

// Create a reducer
const reducer = (state: Todo[], action: Action) => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "delete":
      return state.filter((todo) => todo._id !== action.payload);
    case "update":
      return state.map((todo) =>
        todo._id === action.payload._id ? { ...todo, ...action.payload } : todo
      );
    case "initial":
      return action.payload;
    default:
      return state;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [todos, dispatch] = useReducer(reducer, []);

  const apiUrl = import.meta.env.VITE_SERVER_API_URL;

  // Fetch todos from the API
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiUrl}/todos`);
      const data = await response.json();
      dispatch({ type: "initial", payload: data });
    } catch (error) {
      console.error("Error Fetching Initial Todos: ", error);
    }
  };

  // Add a new todo
  const addItem = async (todoName: string) => {
    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: todoName }), // Send only the todo name
      });

      const newTodo = await response.json(); // Get the newly created todo with the _id
      dispatch({ type: "add", payload: newTodo });
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  // Delete a todo
  const deleteItem = async (id: string) => {
    const prevState = todos; // Save previous state in case of failure
    dispatch({ type: "delete", payload: id }); // Optimistically remove the todo

    try {
      await fetch(`${apiUrl}/todos/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting todo: ", error);
      // Revert to previous state if the request fails
      dispatch({ type: "initial", payload: prevState });
    }
  };

  // Update an existing todo
  const updateItem = async (todo: Todo) => {
    const prevState = todos; // Save previous state in case of failure
    dispatch({ type: "update", payload: todo }); // Update the UI first

    try {
      await fetch(`${apiUrl}/todos/${todo._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: todo.todo }), // Send the updated todo content
      });
    } catch (error) {
      console.error("Error updating todo: ", error);
      // Revert to previous state if the request fails
      dispatch({ type: "initial", payload: prevState });
    }
  };

  // Fetch todos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <DataContext.Provider value={{ todos, addItem, deleteItem, updateItem }}>
      {children}
    </DataContext.Provider>
  );
};
