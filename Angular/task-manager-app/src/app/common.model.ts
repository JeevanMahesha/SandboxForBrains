export interface ITask {
  id: string | null;
  title: string | null;
  description: string | null;
  dueDate: Date | null;
  priority: string | null;
  taskStatus: string | null;
}
export const taskStatus = [
  {
    key: 'todo',
    value: 'Todo',
  },
  {
    key: 'inProgress',
    value: 'In Progress',
  },
  {
    key: 'completed',
    value: 'Completed',
  },
] as const;

export const priorityLevels = [
  {
    key: 'low',
    value: 'Low',
  },
  {
    key: 'medium',
    value: 'Medium',
  },
  {
    key: 'high',
    value: 'High',
  },
] as const;
