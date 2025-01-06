import axios from "axios";
import { useEffect, useState } from "react";

function TodoList() {
  const [todoData, setTodoData] = useState<ITodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get<ITodo[]>("https://jsonplaceholder.typicode.com/todos?_limit=15")
      .then((todoResponse) => {
        setTodoData(todoResponse.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error: {error}</>;
  }

  const filteredTodo = todoData.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>Todo List</h1>
      <div className="container-fluid m-5">
        <input
          type="text"
          placeholder="Search todo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
        />

        <table className="table">
          {filteredTodo.length === 0 ? (
            <tr>
              <td colSpan={3}>No todos found</td>
            </tr>
          ) : null}
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Complete</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodo.map((todo) => (
              <tr key={todo.id}>
                <th scope="row">{todo.id}</th>
                <td>{todo.title}</td>
                <td>{todo.completed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TodoList;

export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
