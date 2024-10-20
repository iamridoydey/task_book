import AppName from "./components/AppName"
import TodoForm from "./components/TodoForm"
import TodoItems from "./components/TodoItems"
import "./styles/output.css"

function App() {

  return (
    <div className={`w-[90%] md:w-[80%] lg:w-[60%] mx-auto flex flex-col gap-4`}>
      <AppName/>
      <TodoForm/>
      <TodoItems/>
    </div>
  )
}

export default App
