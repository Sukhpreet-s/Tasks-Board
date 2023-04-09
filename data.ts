const data: Record<string, TaskList> = {
  "list-1": {
    title: "Tasks To Do",
    tasks: {
      "task-1": { title: "Allow ability to create new lists" },
      "task-2": { title: "Save the data for each user" },
      "task-3": { title: "Ability to store details of a task" },
    },
  },
  "list-2": {
    title: "Tasks In Progress",
    tasks: {
      "task-4": { title: "Refactoring components" },
      "task-5": { title: "Ability to edit a task" },
      "task-6": { title: "Ability to add a task" },
      "task-7": {
        title: "Able to drag tasks within a list or to other lists.",
      },
    },
  },
};

type TaskList = {
  title: string;
  tasks: Record<string, Task>;
};

type Task = {
  title: string;
};

export default data;
export type { TaskList, Task };
