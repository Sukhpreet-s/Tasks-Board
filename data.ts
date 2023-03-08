const data: Record<string, TaskList> = {
  "list-1": {
    title: "Tasks To Do",
    tasks: {
      "task-1": { title: "Research about healthy diet" },
      "task-2": { title: "Compelte an assessment to submit" },
      "task-3": { title: "Walk the dog" },
    },
  },
  "list-2": {
    title: "Tasks In Progress",
    tasks: {
      "task-4": { title: "Research about healthy diet" },
      "task-5": { title: "Compelte an assessment to submit" },
      "task-6": { title: "Walk the dog" },
    },
  },
};

interface TaskList {
  title: string;
  tasks: Record<string, Task>;
}

interface Task {
  title: string;
}

export default data;
export type { TaskList, Task };
