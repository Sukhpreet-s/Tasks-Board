import { Task } from "#root/data";
import TaskCard from "./TaskCard";

import "../App.css";
import { useState } from "react";
import NewTaskCard from "./NewTaskCard";
import {
  DroppableProvided,
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";

type Props = {
  listId: string;
  title: string;
  tasks: Record<string, Task>;
  droppableProvided: DroppableProvided;
};

function TaskList({ listId, title, tasks, droppableProvided }: Props) {
  const [addTaskCard, setAddTaskCard] = useState<boolean>(false);

  const handleShowNewTask = (): void => {
    setAddTaskCard(true);
  };

  return (
    <div
      className="tasklist me-2"
      {...droppableProvided.droppableProps}
      ref={droppableProvided.innerRef}
    >
      <div className="header">
        <h2>{title}</h2>
        <button
          className="add-task-btn"
          type="button"
          onClick={handleShowNewTask}
        >
          +
        </button>
      </div>

      {Object.entries(tasks).map(([taskId, task], index) => (
        <Draggable draggableId={taskId} index={index} key={taskId}>
          {(dragProvided: DraggableProvided) => (
            <TaskCard
              key={taskId}
              listId={listId}
              taskId={taskId}
              title={task.title}
              dragProvided={dragProvided}
            />
          )}
        </Draggable>
      ))}

      {addTaskCard && (
        <NewTaskCard listId={listId} setShowCard={setAddTaskCard} />
      )}

      {droppableProvided.placeholder}
    </div>
  );
}

export default TaskList;
