import {
  useRef,
  ReactNode,
  useReducer,
  useContext,
  createContext,
} from "react";
import data, { TaskList } from "#root/data";
import { addToObject } from "./helper";

type Props = {
  children: ReactNode;
};

type DataContextType = {
  state: State;
  useTaskIdGenerator: () => TaskIdGenerator;
  addNewTask: (listId: string, newTaskId: string, taskTitle: string) => void;
  saveEditedTask: (listId: string, taskId: string, taskTitle: string) => void;
  moveTask: (from: MoveTaskFrom, to: MoveTaskTo) => void;
};

type AddTaskPayload = {
  listId: string;
  newTaskId: string;
  taskTitle: string;
};

type EditTaskPayload = {
  listId: string;
  taskId: string;
  taskTitle: string;
};

type MoveTaskPayload = {
  from: MoveTaskFrom;
  to: MoveTaskTo;
};

type Action =
  | { type: "ADD"; payload: AddTaskPayload }
  | { type: "EDIT"; payload: EditTaskPayload }
  | { type: "MOVE"; payload: MoveTaskPayload };
type State = Record<string, TaskList>;

type TaskIdGenerator = [newTaskId: string, incrementTaskIdNumber: () => void];

type MoveTaskFrom = {
  listId: string;
  index: number;
};
type MoveTaskTo = {
  listId: string;
  index: number;
};

const DataContext: React.Context<DataContextType> =
  createContext<DataContextType>({} as DataContextType);

function DataContextProvider({ children }: Props) {
  const [state, dispatch] = useReducer(taskReducer, { ...data });

  const addNewTask = (
    listId: string,
    newTaskId: string,
    taskTitle: string
  ): void => {
    dispatch({ type: "ADD", payload: { listId, newTaskId, taskTitle } });
  };

  const saveEditedTask = (
    listId: string,
    taskId: string,
    taskTitle: string
  ): void => {
    dispatch({ type: "EDIT", payload: { listId, taskId, taskTitle } });
  };

  const moveTask = (from: MoveTaskFrom, to: MoveTaskTo): void => {
    dispatch({ type: "MOVE", payload: { from, to } });
  };

  const useTaskIdGenerator = (): TaskIdGenerator => {
    // Find the max task id
    const newTaskId = useRef<number>(
      Object.values(state).reduce(
        (prev, curr) => prev + Object.keys(curr.tasks).length,
        0
      ) + 1
    );

    const incrementTaskIdNumber = (): void => {
      // Update newTaskId after using it once
      newTaskId.current = newTaskId.current + 1;
    };

    const toSend = `task-${newTaskId.current}`;

    return [toSend, incrementTaskIdNumber];
  };

  return (
    <DataContext.Provider
      value={{
        state,
        useTaskIdGenerator,
        addNewTask,
        saveEditedTask,
        moveTask,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

function useData(): DataContextType {
  return useContext<DataContextType>(DataContext);
}

function taskReducer(state: State, action: Action): State {
  if (action.type === "ADD") {
    const { listId, newTaskId, taskTitle } = action.payload;
    const listTitle = state[listId].title;
    const listTasks = state[listId].tasks;
    return {
      ...state,
      [listId]: {
        title: listTitle,
        tasks: {
          ...listTasks,
          [newTaskId]: {
            title: taskTitle,
          },
        },
      },
    };
  } else if (action.type === "EDIT") {
    const { listId, taskId, taskTitle } = action.payload;
    const listTitle = state[listId].title;
    const listTasks = state[listId].tasks;
    return {
      ...state,
      [listId]: {
        title: listTitle,
        tasks: {
          ...listTasks,
          [taskId]: {
            title: taskTitle,
          },
        },
      },
    };
  } else if (action.type === "MOVE") {
    const { from, to } = action.payload;
    if (from.listId === to.listId) {
      let toIndex = to.index;

      if (from.index === to.index) return { ...state };
      if (from.index < to.index) {
        toIndex = toIndex - 1;
      } else {
        toIndex = toIndex + 1;
      }

      const listId = from.listId;
      const taskId = Object.keys(state[listId].tasks).at(from.index)!;
      const task = state[from.listId].tasks[taskId];

      const taskList = { ...state[listId].tasks };
      delete taskList[taskId];
      const updatedTasks = addToObject(taskList, taskId, task.title, toIndex);

      return {
        ...state,
        [listId]: {
          title: task.title,
          tasks: { ...updatedTasks },
        },
      };
    } else {
    }

    return {
      ...state,
    };
  } else {
    return { ...state };
  }
}

export { DataContextProvider, useData };
