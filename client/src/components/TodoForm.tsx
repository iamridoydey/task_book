import React, { SyntheticEvent, useContext, useRef, useState } from "react";
import { DataContext } from "../store/DataContext";

const TodoForm: React.FC = () => {
  // Define the ref with the correct type for an HTML input element
  const ref = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track submission state
  const { addItem } = useContext(DataContext);

  const handleOnAdd = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (ref.current && ref.current.value.trim() !== "") {
      setIsSubmitting(true); // Set submitting state to true while adding the todo

      // Add the item to the frontend
      await addItem(ref.current.value.trim());

      ref.current.blur();
      ref.current.value = ""; // Clear the input after adding

      setIsSubmitting(false); // Set submitting state to false after adding
    }
  };

  return (
    <section className={`w-full flex flex-row items-center justify-center`}>
      <form className={`w-full relative`} onSubmit={handleOnAdd}>
        <input
          ref={ref}
          className={`w-full px-8 py-5 rounded-full outline-none font-bold text-xl text-gray-500 focus:outline-4 focus:outline-yellow-500 transition-outline duration-100 ${
            isFocused ? "window_shadow" : ""
          }`}
          placeholder="Enter Your To Do"
          type="text"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className={`absolute w-12 h-12 top-1/2 transform -translate-y-1/2 right-2 z-[10] bg-blue-500 p-6 rounded-full text-white flex items-center justify-center border-4 border-yellow-200 active:border-yellow-500 active:scale-75 transition-border duration-150`}
          type="submit"
          disabled={isSubmitting || !ref.current?.value.trim()} // Disable if submitting or input is empty
        >
          {isSubmitting ? "..." : "Go"} {/* Show loading indicator */}
        </button>
      </form>
    </section>
  );
};

export default TodoForm;
