import { createContext, ReactNode, useReducer } from "react";
import Todo from "../components/Todo";

interface Action {
  type: string;
  payload?: any;
}

interface contextType {
  todos: Todo[];
  addItem: (todo: Todo) => void;
  deleteItem: (id: number) => void;
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
      return state.filter((todo) => {
        return todo.id !== action.payload;
      });

    case "update":
      return state.map((todo) => {
        return todo.id === action.payload.id
          ? { ...todo, todo: action.payload.todo }
          : todo;
      });

    default:
      return state;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [todos, dispatch] = useReducer(reducer, []);

  const addItem = (todo: Todo) => {
    dispatch({ type: "add", payload: todo });
  };

  const deleteItem = (id: number) => {
    dispatch({ type: "delete", payload: id });
  };

  const updateItem = (todo: Todo) => {
    dispatch({ type: "update", payload: todo });
  };
  return (
    <DataContext.Provider value={{ todos, addItem, deleteItem, updateItem }}>
      {children}
    </DataContext.Provider>
  );
};
