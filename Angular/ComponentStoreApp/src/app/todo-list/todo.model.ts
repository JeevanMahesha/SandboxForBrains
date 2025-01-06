export interface ITodoComponentState {
  isLoading: boolean;
  errorValue: string | null;
  todoList: ITodo[]
}

export interface ITodo {
  userName: string
}
