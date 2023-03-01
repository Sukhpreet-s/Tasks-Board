const data: TaskList[] = [
  {
    listId: "list-1",
    title: "Tasks To Do",
    tasks: [
      { taskId: "task-1", title: "Research about healthy diet" },
      { taskId: "task-2", title: "Compelte an assessment to submit" },
      { taskId: "task-3", title: "Walk the dog" },
    ],
  },
  {
    listId: "list-2",
    title: "Tasks In Progress",
    tasks: [{ taskId: "task-4", title: "Prepare a presentation" }],
  },
  {
    listId: "list-3",
    title: "Tasks Done",
    tasks: [
      { taskId: "task-5", title: "Email the doctor for an appointment" },
      { taskId: "task-6", title: "Do meal prep for the week" },
      { taskId: "task-7", title: "Fill out tax forms" },
    ],
  },
];

interface TaskList {
  listId: string;
  title: string;
  tasks: Task[];
}

interface Task {
  taskId: string;
  title: string;
}

export default data;
export type { TaskList, Task };
