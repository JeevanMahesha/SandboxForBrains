import axios from "axios";
import { useEffect, useState } from "react";

function TodoList() {
  const [todoData, setTodoData] = useState<ITodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <>
      <h1>Todo List</h1>
      <div className="container-fluid m-5">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Complete</th>
            </tr>
          </thead>
          <tbody>
            {todoData.map((todo) => (
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
