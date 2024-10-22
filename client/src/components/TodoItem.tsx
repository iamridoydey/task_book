import React, { SyntheticEvent, useContext, useState } from "react";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { DataContext } from "../store/DataContext";
import Todo from "./Todo"; // Ensure Todo type has _id

const TodoItem: React.FC<Todo> = ({ _id, todo }) => {
  const [editValue, setEditValue] = useState(todo);
  const { deleteItem, updateItem } = useContext(DataContext);
  const [isEditable, setIsEditable] = useState(false);

  const handleOnDelete = (_id: string) => {
    deleteItem(_id);
  };

  const handleOnChange = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    setEditValue(input.value);
  };

  const handleOnUpdate = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (todo !== editValue) {
      updateItem({ _id, todo: editValue });
    }

    setIsEditable(false);
  };

  return (
    <div
      className={`w-full bg-yellow-400 p-4 rounded-md flex items-center justify-between`}
    >
      {isEditable ? (
        <input
          onChange={handleOnChange}
          className={`w-[200px] esm:w-[350px] sm:w-[70%] rounded outline-none text-green font-bold text-xl hover:outline-green-500`}
          value={editValue}
          type="text"
          autoFocus
          onBlur={handleOnUpdate} // Update on blur
          onKeyDown={(e) => e.key === "Enter" && handleOnUpdate(e)}
        />
      ) : (
        <h4 className={`font-bold text-xl`}>{todo}</h4>
      )}
      <div className={`flex flex-row gap-2 text-xl sm:text-2xl`}>
        <span
          onClick={() => setIsEditable((prev) => !prev)}
          className={`cursor-pointer`}
        >
          <MdEdit />
        </span>
        <span onClick={() => handleOnDelete(_id)} className={`cursor-pointer`}>
          <MdDeleteForever color="red" />
        </span>
      </div>
    </div>
  );
};

export default TodoItem;
