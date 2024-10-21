import React, { useContext } from 'react'
import TodoItem from './TodoItem'
import { DataContext } from '../store/DataContext'

const TodoItems:React.FC = () => {
  const {todos} = useContext(DataContext)
  console.log(todos)
  return (
    <section
      className={`w-full flex flex-col items-center justify-between gap-2`}
    >
      {todos.map((item) => (
        <TodoItem key={item._id} _id={item._id} todo={item.todo} />
      ))}
    </section>
  );
}

export default TodoItems